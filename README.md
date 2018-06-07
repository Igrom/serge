# Serge
Serge to system zarządzania magazynem napisany na potrzeby niewielkiego
wirtualnego centrum logistycznego wzorowanego na duńskim centrum logi-
stycznym, w którym autor pracował przez kilka dni latem 2014 roku.
Magazyn, o którym mowa, jest handlowym centrum konsolidacyjnym wy-
budowanym na potrzeby sieci największych hipermarketów i zajmuje się re-
alizacją względnie stałych zamówień na potrzeby poszczególnych lokalnych
punktów handlowych obsługiwanych przez ten magazyn.

Serge zbudowany jest z klastra mikroserwi-
sów napisanych przy użyciu platformy programistycznej Node.js, zaprojekto-
wanych do uruchomienia na bezserwerowej platformie obliczeniowej Amazon
Lambda i wykorzystujących rozwiązania z przekroju oferty dostawcy usług
chmury obliczeniowej Amazon Web Services. Komponenty systemu komu-
nikują się ze sobą poprzez bezstanowe (tzn. bez przechowywania informacji
49pomiędzy żądaniami) interfejsy HTTP, stosując nowoczesne praktyki hyper-
media. Konstrukcja i utrzymanie serwisów zaprojektowano w praktykach
ciągłej integracji, automatyzując testy jednostkowe i integracyjne, jak rów-
nież konfigurując automatyczne publikowanie nowych wersji kodu.

# Licencja
MIT
