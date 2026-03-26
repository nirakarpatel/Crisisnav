const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const CRISIS_DATA = [
  {
    id: 'fire',
    title: 'Fire Incident',
    icon: 'ph-fill ph-fire',
    desc: 'If you see smoke or fire.',
    severity: 'critical',
    accentColor: '#f43f5e',
    steps: [
      { title: 'Pull the Alarm', desc: 'Find the red box on the wall and pull the handle down hard.' },
      { title: 'Call for Help', desc: 'Call 911. Tell them your name and where the fire is.' },
      { title: 'Get Out Fast', desc: 'Walk quickly to the nearest door. Don\'t stop to pick up your things.' },
      { title: 'Meet at the Tree', desc: 'Go to the safe spot outside where everyone meets and stay there.' }
    ]
  },
  {
    id: 'accident',
    title: 'Workplace Accident',
    icon: 'ph-fill ph-warning-octagon',
    desc: 'If someone gets hurt or something breaks.',
    severity: 'high',
    accentColor: '#f59e0b',
    steps: [
      { title: 'Stop Everything', desc: 'Push the big red "STOP" button on the machine right away.' },
      { title: 'Tell a Grown-up', desc: 'Run and find a teacher or boss and tell them someone is hurt.' },
      { title: 'Stay Back', desc: 'Keep away from the broken machine so you don\'t get hurt too.' },
      { title: 'Wait for the Doctor', desc: 'Stay calm and wait for the ambulance to arrive.' }
    ]
  },
  {
    id: 'chemical',
    title: 'Chemical Leak',
    icon: 'ph-fill ph-flask',
    desc: 'If something smelly or sticky spills.',
    severity: 'critical',
    accentColor: '#8b5cf6',
    steps: [
      { title: 'Don\'t Touch It', desc: 'Stay away from the spill. Don\'t smell it or touch it!' },
      { title: 'Cover Your Nose', desc: 'Use your shirt or a mask to cover your mouth and nose.' },
      { title: 'Leave the Room', desc: 'Go outside where the air is fresh. Close the door behind you.' },
      { title: 'Wash Your Hands', desc: 'If anything touched your skin, wash it with lots of water.' }
    ]
  },
  {
    id: 'medical',
    title: 'Medical Emergency',
    icon: 'ph-fill ph-heartbeat',
    desc: 'If someone falls down or feels very sick.',
    severity: 'high',
    accentColor: '#f97316',
    steps: [
      { title: 'Check if they Wake Up', desc: 'Gently shake their shoulder and ask "Are you okay?".' },
      { title: 'Call 911', desc: 'Tell the person on the phone that someone is sick and needs a doctor.' },
      { title: 'Stay with Them', desc: 'Don\'t leave the person alone. Hold their hand and talk to them.' },
      { title: 'Open the Door', desc: 'Make sure the door is unlocked so the doctors can get in easily.' }
    ]
  }
];

app.get('/api/crises', (req, res) => {
  res.json(CRISIS_DATA);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
