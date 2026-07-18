int thresholdLow = 4;  // triggers the yellow light
int thresholdHigh = 8; // triggers the red light

int ledGreen = 11;
int ledYellow = 12;
int ledRed = 13;

int fnd[] = {2, 3, 4, 5, 6, 7, 8, 9}; // 7-digit segment
byte num[10][8] = {
    {1, 1, 0, 0, 0, 0, 0, 0},
    {1, 1, 1, 1, 1, 0, 0, 1},
    {1, 0, 1, 0, 0, 1, 0, 0},
    {1, 0, 1, 1, 0, 0, 0, 0},
    {1, 0, 0, 1, 1, 0, 0, 1},
    {1, 0, 0, 1, 0, 0, 1, 0},
    {1, 0, 0, 0, 0, 0, 1, 0},
    {1, 1, 1, 1, 1, 0, 0, 0},
    {1, 0, 0, 0, 0, 0, 0, 0},
    {1, 0, 0, 1, 0, 0, 0, 0},
};

int mapped;
const int sampleWindow = 3; // sampling time
unsigned int sample;

void setup()
{
  Serial.begin(9600);
  pinMode(ledGreen, OUTPUT);
  pinMode(ledYellow, OUTPUT);
  pinMode(ledRed, OUTPUT);
  digitalWrite(ledGreen, HIGH);

  for (int i = 0; i < 8; i++)
  {
    pinMode(fnd[i], OUTPUT);
  }
}

void loop()
{
  unsigned long startMillis = millis(); // start sampling
  unsigned int peakToPeak = 0;

  unsigned int signalMax = 0;
  unsigned int signalMin = 1024;

  // read the Max. and Min. of decibels
  while (millis() - startMillis < sampleWindow)
  {
    sample = analogRead(A0);
    if (sample < 1024) // toss out spurious readings
    {
      if (sample > signalMax)
      {
        signalMax = sample; // save just the max levels
      }
      else if (sample < signalMin)
      {
        signalMin = sample; // save just the min levels
      }
    }
  }
  peakToPeak = signalMax - signalMin; // calculate the average
  double volts = peakToPeak * 25;     // transform it to real levels

  constrain(mapped, 0, 9);
  mapped = map(volts, 0, 250, 0, 9);

  Serial.println(volts);

  for (int i = 0; i < 8; i++)
  {
    if (mapped == 9)
    {
      digitalWrite(fnd[i], num[9][i]);
    }
    else
    {
      digitalWrite(fnd[i], num[mapped][i]);
    }
  }
  if ((mapped >= thresholdLow) and (mapped <= thresholdHigh))
  {
    digitalWrite(ledYellow, HIGH);
    digitalWrite(ledGreen, LOW);
    delay(1500);
    digitalWrite(ledYellow, LOW);
    digitalWrite(ledGreen, HIGH);
  }
  if (mapped >= thresholdHigh)
  {
    for (int i = 0; i < 8; i++)
    {
      digitalWrite(fnd[i], num[9][i]);
    }
    digitalWrite(ledGreen, LOW);
    digitalWrite(ledRed, HIGH);
    delay(300);
    digitalWrite(ledRed, LOW);
    delay(300);
    digitalWrite(ledRed, HIGH);
    delay(300);
    digitalWrite(ledRed, LOW);
    delay(300);
    digitalWrite(ledRed, HIGH);
    delay(3000);
    digitalWrite(ledRed, LOW);
    digitalWrite(ledGreen, HIGH);
  }

  delay(150);
}
