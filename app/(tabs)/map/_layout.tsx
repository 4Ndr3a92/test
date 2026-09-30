import { Stack } from 'expo-router';

export default function MapLayout() {
  return (
    <Stack>
      {/* La schermata principale della mappa */}
      <Stack.Screen name="index" options={{ 
        headerShown: false, 
        animation: 'slide_from_bottom',
        animationDuration: 300,
        
        }} />
      
      {/* Configurazione delle 3 rotte dei modali come fogli dal basso nativi */}
      <Stack.Screen 
        name="trail-detail" 
        
        options={{ 
          presentation: 'formSheet', // Su iOS crea il foglio nativo trascinabile
        
        
          sheetAllowedDetents:  'fitToContents', 
          sheetGrabberVisible: false, // Mostra la barretta orizzontale in alto per trascinare
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'slide_from_bottom',
          animationDuration: 300,
        
        
        }} 
        
      />
  


    </Stack>
  );
}
