import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Counter() {
  ///declaro una variable de estado 'count' y su función para actualizarla
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Has presionado {count} veces</Text>
      <Button title="Incrementar" onPress={() => setCount(count + 1)} />
      <Button title="Reiniciar" onPress={() => setCount(0)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c8cdffff",
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
  },
});
