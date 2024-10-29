import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

const App = () => {
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Timer interval ID

  const startTimer = () => {
    if (intervalId) return; // Prevent multiple intervals
    const id = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 0) {
          clearInterval(id); // Stop the timer when it reaches 0
          setIntervalId(null); // Clear interval ID
          return 0; // Return 0 to prevent negative time
        }
        return prevTimer - 1; // Decrease timer by 1 second
      });
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null); // Reset interval ID
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimer(0); // Reset timer to 0
    setSelectedHours(0); // Clear input field
    setSelectedMinutes(0); // Clear input field
    setSelectedSeconds(0); // Clear input field
  };

  const handleInputChange = () => {
    // Calculate total seconds from inputs
    setTimer(selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds); // Convert to total seconds
  };

  useEffect(() => {
    handleInputChange(); // Update timer whenever inputs change
  }, [selectedHours, selectedMinutes, selectedSeconds]);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on unmount
    };
  }, [intervalId]);

  const isStartDisabled = timer <= 0; // Disable Start button if timer is 0

  // Function to format timer into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    // The padStart method in JavaScript is used to add padding to the beginning of a string until it reaches a specified length.
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timer)}</Text>
      <View style={styles.pickerContainer}>
        {/*  Picker is a component from the @react-native-picker/picker library that lets the user select a value from a dropdown list */}
        <Picker
          selectedValue={selectedHours}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedHours(itemValue)}
        >
          {[...Array(24).keys()].map(hour => (
            <Picker.Item key={hour} label={`${hour} Hour${hour !== 1 ? 's' : ''}`} value={hour} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMinutes}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
        >
          {[...Array(60).keys()].map(minute => (
            <Picker.Item key={minute} label={`${minute} Minute${minute !== 1 ? 's' : ''}`} value={minute} />
          ))}
        </Picker>
      </View>
      <View style={styles.sliderContainer}>
        <Text>Seconds: {selectedSeconds}</Text>
        {/* This <Slider> component provides a sliding control, allowing the user to select a value within a specified range by dragging a knob or handle */}
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={59}
          value={selectedSeconds}
          onValueChange={(value) => setSelectedSeconds(Math.floor(value))}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#C4C4C4"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={startTimer} disabled={isStartDisabled} />
        <Button title="Stop" onPress={stopTimer} disabled={!intervalId} />
        <Button title="Reset" onPress={resetTimer} disabled={timer === 0} />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 40,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 100,
    marginHorizontal: 5,
  },
  sliderContainer: {
    width: '80%',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
  },
});

export default App;
