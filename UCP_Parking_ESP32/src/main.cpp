#include <Arduino.h>

#define PIN_SENSOR_ENTRADA 4
#define PIN_SENSOR_SALIDA  2

bool estadoAnteriorEntrada = HIGH;
bool estadoAnteriorSalida = HIGH;

void setup() {

  Serial.begin(115200);

  pinMode(PIN_SENSOR_ENTRADA, INPUT_PULLUP);
  pinMode(PIN_SENSOR_SALIDA, INPUT_PULLUP);

  Serial.println("--- SISTEMA PARQUEADERO UCP INICIADO ---");
}

void loop() {

  // =========================
  // LEER ESTADOS ACTUALES
  // =========================

  bool estadoEntrada = digitalRead(PIN_SENSOR_ENTRADA);
  bool estadoSalida = digitalRead(PIN_SENSOR_SALIDA);

  // =========================
  // BOTÓN ENTRADA
  // Detecta SOLO el click
  // =========================

  if (estadoAnteriorEntrada == HIGH && estadoEntrada == LOW) {

    Serial.println("S_ENTRADA_ACTIVO");

    delay(80);
  }

  // =========================
  // BOTÓN SALIDA
  // Detecta SOLO el click
  // =========================

  if (estadoAnteriorSalida == HIGH && estadoSalida == LOW) {

    Serial.println("S_SALIDA_ACTIVO");

    delay(80);
  }

  // =========================
  // GUARDAR ESTADOS
  // =========================

  estadoAnteriorEntrada = estadoEntrada;
  estadoAnteriorSalida = estadoSalida;

  delay(10);
}