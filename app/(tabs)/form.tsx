import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../hooks/useApiFetch";

type FormPayload = {
  nombre: string;
  modalidad: string;
  phone: string;
  date: string; 
};

export default function FormScreen() {
  const [nombre, setName] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !modalidad.trim() || !phone.trim()) {
      Alert.alert(
        "Formulario incompleto",
        "Por favor completa todos los campos."
      ); 
      return;
    }

    const payload: FormPayload = {
      nombre: nombre.trim(),
      modalidad: modalidad.trim(),
      phone: phone.trim(),
      date: date.toISOString().slice(0, 10),
    };

    setLoading(true);
    const { data, error } = await api.post<{ id: number; message: string }>(
      "/crear",
      payload
    );
    setLoading(false);

    if (error) {
      Alert.alert(
        "Error al enviar",
        `${error.message} (status: ${error.status})`
      );
      return;
    }

    Alert.alert("¡Enviado!", `ID: ${data?.id}\n${data?.message}`);
    setName("");
    setModalidad("");
    setPhone("");
    setDate(new Date());
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#4a4e46ff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Formulario</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu nombre"
            placeholderTextColor="#d9d4d2"
            value={nombre}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
            accessibilityLabel="Nombre"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Modalidad</Text>
          <TextInput
            style={styles.input}
            placeholder="Modalidad del Programa"
            placeholderTextColor="#d9d4d2"
            value={modalidad}
            onChangeText={setModalidad}
            keyboardType="modalidad"
            autoCapitalize="none"
            returnKeyType="next"
            accessibilityLabel="Modalidad del Programa"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="3001234567"
            placeholderTextColor="#d9d4d2"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="done"
            accessibilityLabel="Teléfono"
          />
        </View>

        <View className="field">
          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            activeOpacity={0.8}
            style={[styles.input, styles.dateButton]}
            accessibilityLabel="Seleccionar fecha"
          >
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
              maximumDate={new Date(2100, 11, 31)}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.submit, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Enviar formulario"
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.submitText}>Enviar</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 32, alignItems: "stretch" },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: { color: "#fff", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "rgba(153, 140, 140, 0.12)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(179, 162, 162, 0.25)",
  },
  dateButton: { justifyContent: "center" },
  dateText: { color: "#fff" },
  submit: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "#5d473bff", fontWeight: "700", fontSize: 16 },
});
