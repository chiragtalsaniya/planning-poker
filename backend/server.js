const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage
const rooms = new Map();
const users = new Map();

// Helper functions
function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      name: roomId,
      storyTitle: '',
      isRevealed: false,
      revealedByUserId: null,
      revealedByUserName: null,
      createdAt: new Date(),
      users: [],
      votes: new Map(),
      revealRequests: []
    });
  }
  return rooms.get(roomId);
}

function getRoomState(roomId) {
  const room = getRoom(roomId);
  const userList = room.users.map(userId => {
    const user = users.get(userId);
    return {
      id: user.id,
      name: user.name,
      isCreator: user.isCreator,
      hasVoted: room.votes.has(userId)
    };
  });

  return {
    roomId: room.id,
    storyTitle: room.storyTitle,
    isRevealed: room.isRevealed,
    revealedByUserName: room.revealedByUserName,
    users: userList,
    votedCount: room.votes.size,
    totalUsers: userList.length,
    revealRequests: room.revealRequests || []
  };
}

function getRevealedVotes(roomId) {
  const room = getRoom(roomId);
  const votes = [];
  
  room.users.forEach(userId => {
    const user = users.get(userId);
    const vote = room.votes.get(userId);
    votes.push({
      userId: user.id,
      userName: user.name,
      vote: vote || null
    });
  });

  // Calculate statistics
  const numericVotes = votes
    .filter(v => v.vote && !isNaN(v.vote))
    .map(v => parseFloat(v.vote));

  const stats = {
    average: numericVotes.length > 0 
      ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
      : null,
    highest: numericVotes.length > 0 ? Math.max(...numericVotes) : null,
    lowest: numericVotes.length > 0 ? Math.min(...numericVotes) : null,
    voteCounts: {}
  };

  votes.forEach(v => {
    if (v.vote) {
      stats.voteCounts[v.vote] = (stats.voteCounts[v.vote] || 0) + 1;
    }
  });

  return { votes, stats };
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userName, isCreator }) => {
    const room = getRoom(roomId);
    
    // Check for duplicate names
    const nameExists = room.users.some(userId => {
      const user = users.get(userId);
      return user.name.toLowerCase().trim() === userName.toLowerCase().trim();
    });

    if (nameExists) {
      socket.emit('join-error', { message: 'Name already taken in this room' });
      return;
    }

    // Create user
    const user = {
      id: socket.id,
      name: userName.trim(),
      isCreator: isCreator || room.users.length === 0,
      roomId: roomId,
      joinedAt: new Date()
    };

    users.set(socket.id, user);
    room.users.push(socket.id);
    socket.join(roomId);

    // Send current state to joining user
    socket.emit('joined', {
      userId: socket.id,
      isCreator: user.isCreator,
      state: getRoomState(roomId)
    });

    // Notify all users in room
    io.to(roomId).emit('room-update', getRoomState(roomId));
    console.log(`${userName} joined room ${roomId} as ${isCreator ? 'creator' : 'participant'}`);
  });

  socket.on('cast-vote', ({ roomId, vote }) => {
    const room = getRoom(roomId);
    const user = users.get(socket.id);

    if (!user || user.roomId !== roomId) return;

    room.votes.set(socket.id, vote);
    
    // Notify user of their vote
    socket.emit('vote-confirmed', { vote });
    
    // Update room state for all users
    io.to(roomId).emit('room-update', getRoomState(roomId));
  });

  socket.on('request-reveal', ({ roomId, userName }) => {
    const room = getRoom(roomId);
    const user = users.get(socket.id);

    if (!user || user.isCreator) return;

    if (!room.revealRequests.includes(userName)) {
      room.revealRequests.push(userName);
      io.to(roomId).emit('room-update', getRoomState(roomId));
    }
  });

  socket.on('reveal-votes', ({ roomId }) => {
    const room = getRoom(roomId);
    const user = users.get(socket.id);

    if (!user || !user.isCreator) return;

    room.isRevealed = true;
    room.revealedByUserId = socket.id;
    room.revealedByUserName = user.name;

    const revealData = getRevealedVotes(roomId);
    
    io.to(roomId).emit('votes-revealed', {
      ...revealData,
      revealedBy: user.name,
      state: getRoomState(roomId)
    });
  });

  socket.on('reset-votes', ({ roomId }) => {
    const room = getRoom(roomId);
    const user = users.get(socket.id);

    if (!user || !user.isCreator) return;

    room.votes.clear();
    room.isRevealed = false;
    room.revealedByUserId = null;
    room.revealedByUserName = null;
    room.revealRequests = [];

    io.to(roomId).emit('votes-reset', getRoomState(roomId));
  });

  socket.on('update-story', ({ roomId, storyTitle }) => {
    const room = getRoom(roomId);
    const user = users.get(socket.id);

    if (!user || !user.isCreator) return;

    room.storyTitle = storyTitle;
    io.to(roomId).emit('story-updated', { storyTitle, state: getRoomState(roomId) });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    
    if (user) {
      const room = getRoom(user.roomId);
      room.users = room.users.filter(id => id !== socket.id);
      room.votes.delete(socket.id);
      
      io.to(user.roomId).emit('room-update', getRoomState(user.roomId));
      users.delete(socket.id);
      
      console.log(`${user.name} disconnected from room ${user.roomId}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
