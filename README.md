Instalar Android Studio (https://www.youtube.com/watch?v=hwjnMH7a8Z8) <br/>
Crear proyecto en firebase, llamalo mobile-map-app<br/>
En la consola de Firebase, añadir una aplicacion android.<br/>
Ponerle de nombre com.mobilemapapp.firebase, continuar y descargar el archivo google-services.json, siguiente, siguiente, e ir a la consola.<br/>
Mover el archivo a tu carpeta raiz del frontend.<br/>
En la consola de Firebase, seleccionar Authentication, comenzar, y Correo electronico/contraseña y activar el primer slide.<br/>
Volver a la consola de Firebase, justo debajo del nombre del proyecto tendras la app (com.mobilemapapp.firebase) seleccionalo y ve a su configuracion, guarda la clave de API web y el id del proyecto.<br/>
<br/>
Abrir la carpeta del frontend con Visual Studio Code, abre una terminal y ejecuta el comando "npm run install".<br/>
Luego de instalarse, ejecuta el comando "npx expo run:android". Esto ejecutara el emulador, abrira la app y creara una carpeta llamada "android".<br/>
Cierra el emulador y cierra el servidor presionando control + C en la consola.<br/>
Crea un archivo .env en la raiz del proyecto.<br/>
Dentro del archivo .env:<br/>
<br/>
FIREBASE_PROJECT_ID="" //ID DEL PROYECTO QUE GUARDASTE ANTERIORMENTE<br/>
<br/>
FIREBASE_APIKEY="" //KEY QUE GUARDASTE ANTERIORMENTE<br/>
<br/>
EXPO_PUBLIC_BACKEND_URL="http://10.0.2.2:3000/api" //DEJAR ASI<br/>
<br/>
GOOGLE_API_KEY='AIzaSyCR5r_fMK-wrQjIfg7PLt3CsETUDdYHKdk' //ESTA ES TU KEY DE GOOGLE MAPS, DEJARLA ASI<br/>
<br/>
EXPO_PUBLIC_STRIPE_PUBLIC_KEY="" //LA MISMA KEY PUBLISHABLE DE STRIPE QUE USASTE EN EL BACKEND.<br/>
<br/>

Con esto deberia funcionar la app, exceptuando el mapa. Para hacer que funcione Google Maps: <br/>
Busca la carpeta "android" que se creo automaticamente en el paso anterior.<br/>
Dentro de android, busca la carpeta app, luego src, luego main, y abre el archivo AndroidManifest.xml<br/>
Dentro del archivo AndroidManifest.xml, busca la etiqueta <application android:name=".MainApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="true" android:theme="@style/AppTheme" android:supportsRtl="true">, da un enter, y copia y pega lo siguiente:<br/>
<br/>
 <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="AIzaSyCR5r_fMK-wrQjIfg7PLt3CsETUDdYHKdk"/><br/>
     <br/>

Esta etiqueta deberia estar arriba de varias mas que tambien empiecen por <meta-data>.<br/>
<br/>
Una vez hecho esto, deberia funcionar sin problema. Ejecuta el comando npx expo run:android y listo.
