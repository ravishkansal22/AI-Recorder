import { useState, useEffect, useRef } from 'react';
import { socket } from '../services/socket';
import { api } from '../services/api';

const SIMULATED_STEPS = [
  {
    id: 's1',
    type: 'Navigate',
    details: 'https://shop.example.com/checkout'
  },
  {
    id: 's2',
    type: 'Click',
    details: '[data-testid="add-to-cart-btn"]',
    selfHealed: true
  },
  {
    id: 's3',
    type: 'Type',
    param: '{email}',
    details: '#email -> faker.email()'
  },
  {
    id: 's4',
    type: 'Assert',
    details: '.order-total contains "$49.99"'
  },
  {
    id: 's5',
    type: 'Click',
    details: '.checkout-submit -> Tier 2 ARIA adopted',
    selfHealed: true
  },
  {
    id: 's6',
    type: 'Assert URL',
    details: '/order-confirmation = regex'
  }
];

export function useRecorder() {
  const [steps, setSteps] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [harDual, setHarDual] = useState(true);
  const [targetUrl, setTargetUrl] = useState('https://shop.example.com/checkout');
  
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true); // default to simulation if server not found
  const [simStepIndex, setSimStepIndex] = useState(0);

  const timerRef = useRef(null);
  const simTimeoutRefs = useRef([]);

  // Connect to Socket server on mount
  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      setIsSimulation(false);
      console.log('Connected to backend recording server');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setIsSimulation(true);
      console.log('Disconnected from backend recording server, using simulation mode');
    };

    const onStepRecord = (step) => {
      setSteps((prev) => [...prev, step]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('step-recorded', onStepRecord);

    // Initial check
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('step-recorded', onStepRecord);
      socket.disconnect();
      clearTimer();
      clearSimTimeouts();
    };
  }, []);

  // Timer runner
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isRecording, isPaused]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearSimTimeouts = () => {
    simTimeoutRefs.current.forEach((t) => clearTimeout(t));
    simTimeoutRefs.current = [];
  };

  // Start recording
  const startRecording = async (url) => {
    const cleanUrl = url || targetUrl;
    setTargetUrl(cleanUrl);
    setSteps([]);
    setDuration(0);
    setSimStepIndex(0);
    clearSimTimeouts();
    setIsPaused(false);
    setIsRecording(true);

    if (!isSimulation && isConnected) {
      try {
        await api.startRecording(cleanUrl);
      } catch (err) {
        console.error('Failed to start real recording, falling back to simulator', err);
        setIsSimulation(true);
        triggerSimulationFlow(cleanUrl);
      }
    } else {
      // Run Simulation Flow
      setIsSimulation(true);
      triggerSimulationFlow(cleanUrl);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    setIsRecording(false);
    setIsPaused(false);
    clearTimer();
    clearSimTimeouts();

    if (!isSimulation && isConnected) {
      try {
        await api.stopRecording();
      } catch (err) {
        console.error('Failed to stop recording in backend', err);
      }
    }
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Manual step addition (for simulation control panel)
  const addManualStep = (step) => {
    setSteps((prev) => [...prev, { ...step, id: Date.now().toString() }]);
  };

  // Trigger step-by-step automatic simulation
  const triggerSimulationFlow = (url) => {
    // Immediately add Navigate step
    const navigateStep = {
      id: 'sim-nav',
      type: 'Navigate',
      details: url
    };
    setSteps([navigateStep]);
    setSimStepIndex(1);

    // Schedule remaining steps
    const scheduleStep = (index, delay) => {
      const timeoutId = setTimeout(() => {
        if (index < SIMULATED_STEPS.length) {
          const nextStep = SIMULATED_STEPS[index];
          setSteps((prev) => [...prev, nextStep]);
          setSimStepIndex(index + 1);
        }
      }, delay);
      simTimeoutRefs.current.push(timeoutId);
    };

    // Schedule: 
    // Step 2 (Click add-to-cart) at 3s
    scheduleStep(1, 3000);
    // Step 3 (Type email) at 6s
    scheduleStep(2, 6000);
    // Step 4 (Assert order total) at 9s
    scheduleStep(3, 9000);
    // Step 5 (Click self-healed place order) at 12s
    scheduleStep(4, 12000);
    // Step 6 (Assert URL confirmation) at 15s
    scheduleStep(5, 15000);
  };

  // Manual simulation controls for debugging/walkthrough
  const simulateNextStep = () => {
    if (simStepIndex < SIMULATED_STEPS.length) {
      const nextStep = SIMULATED_STEPS[simStepIndex];
      // Override details for navigate if custom targetUrl is used
      if (simStepIndex === 0) {
        nextStep.details = targetUrl;
      }
      setSteps((prev) => [...prev, nextStep]);
      setSimStepIndex((prev) => prev + 1);
    }
  };

  return {
    steps,
    isRecording,
    isPaused,
    duration,
    harDual,
    setHarDual,
    targetUrl,
    setTargetUrl,
    isConnected,
    isSimulation,
    setIsSimulation,
    startRecording,
    stopRecording,
    togglePause,
    addManualStep,
    simulateNextStep,
    resetSimulation: () => {
      setSteps([]);
      setDuration(0);
      setSimStepIndex(0);
      setIsRecording(false);
      setIsPaused(false);
      clearSimTimeouts();
    }
  };
}
