import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  getAdvertisingId,
  requestTrackingAuthorization,
} from 'react-native-advertising-identifier';

export default function App() {
  const [trackingStatus, setTrackingStatus] = useState('pending');
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setTrackingStatus(await requestTrackingAuthorization());
        setInfo(await getAdvertisingId());
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AdvertisingId example</Text>
      <Text style={styles.row}>Tracking status: {trackingStatus}</Text>
      <Text style={styles.row}>
        Advertising ID: {info ? String(info.advertisingId) : '--'}
      </Text>
      <Text style={styles.row}>
        Limit ad tracking:{' '}
        {info ? String(info.isLimitAdTrackingEnabled) : '--'}
      </Text>
      {error != null && <Text style={styles.error}>Error: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  row: {
    textAlign: 'center',
    marginBottom: 5,
  },
  error: {
    textAlign: 'center',
    color: '#c00',
    marginTop: 10,
  },
});
