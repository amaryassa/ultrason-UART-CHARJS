  // Projet Ultrason ? compl?ter et corriger
  // sans oublier les commentaires !

    int etape;

     void afficheChiffre(char chiffre,char position){

      LATA = 0x01 << position;
      switch(chiffre){
      case 0: LATD=0b10111111; break;
      case 1: LATD=0b00000110; break;
      case 2: LATD=0b01011011; break;
      case 3: LATD=0b01001111; break;
      case 4: LATD=0b01100110; break;
      case 5: LATD=0b01101101; break;
      case 6: LATD=0b11111101; break;
      case 7: LATD=0b00000111; break;
      case 8: LATD=0b11111111; break;
      case 9: LATD=0b11101111; break;

      }
     }


void afficheNombre(float var){
      char chiffre0,chiffre1,chiffre2,chiffre3;
      chiffre3 = var/1000;
      var -= chiffre3*1000;
      chiffre2 = var/100;
      var -= chiffre2*100;
      chiffre1 = var/10;
      var -= chiffre1*10;
      chiffre0 = (char)var;
      Delay_ms(1);
      afficheChiffre(chiffre0,0);
      Delay_ms(1);
       afficheChiffre(chiffre1,1);
       Delay_ms(1);
        afficheChiffre(chiffre2,2);
        Delay_ms(1);
         afficheChiffre(chiffre3,3);
      Delay_ms(1);
}

 int uart_rd;
 void main(void) {
    int compte = 0;

      float nombreaffiche = 0;
      //ANSELC = 0x00;
      TRISA = 0x00;
      TRISC = 0x01;   //input trigger
//      TRISRC6 = 0x01; //Pour le bluetooth
      TRISD = 0x00;  //sortie

      LATA = 0x00;
      LATC = 0x00;
      LATD = 0x00;
      etape = 0;
      ///Partie Initialisation UART/////

      UART1_Init(9600);               // Initialize UART module at 9600 bps
      Delay_ms(100);                  // Wait for UART module to stabilize

      UART1_Write_Text("Start");
      UART1_Write(13);
      UART1_Write(10);
      ///Fin init UART//////


      afficheNombre((int)nombreaffiche);

      while(1){
     //  afficheNombre((int)nombreaffiche);
        switch(etape) {

         case 0:
         LATC1_bit = 1;
         compte = 0;
         etape++ ;
         break;

         case 1:
         delay_ms(1);
         LATC1_bit = 0;
         etape++ ;
         break;


         case 2:
                 if(PORTC & 0x01){
                    while(PORTC & 0x01){
                                compte++;
                                delay_us(10);
                                }
                                etape++;
                                 }
                                break;

         case 3:
          nombreaffiche = (int)compte*10/58.0;

         Delay_ms(1);
         afficheNombre((int)nombreaffiche);
         UART1_Write(nombreaffiche);
         etape=0;
         break;
        }
         ///uart_rd = nombreaffiche;
          //UART1_Write(0x21);

      }
    }