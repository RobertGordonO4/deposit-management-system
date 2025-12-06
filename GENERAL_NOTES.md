##

- Q: Subor .sqlite ktory obsahuje DB data a prejavuju sa v nom lokalne zmeny by sa ak sa nemylim nemal commitovat takze nemal byt gitignornuty v ramci repa? Mal som s tym trochu problem to dodatocne nastavit tak som to hlbsie neriesil ale zaroven ten subor je pod foldrom /server/ ku ktoremu je v zadani napisane explicitne ze ho nemozem menit cize commitovat zmeny do neho asi nemam?

- Detail: Ak by bola moznost upravit aj veci v /server/ chcel som pridat novy endpoint na "activate" button pre inactive zaznamy v tabulke produktov kedze take nieco mi v tom celom deme trochu chyba. Taktiez by sa search nad celym datasetom a filtrovanie na intervaly hodnot ktore som pridal pravdepodobne dali spravit optimalnejsie cez BE.

- Q: Hrozny performance nad velkym datasetom v ramci Radix dropdown componentu bol skryty chytak?

- Minor spot: V datasete ktory bol uz v repe su produkty pridane k datumu v buducnosti (koniec Decembra 2025.. cize v seckii recent products - kde sa zobrazuje 5 najnovsich sa nezobrazia nove produkty ani keby som ich aktivoval.. zobrazili by sa ked som zvacsil pocet zaznamov ktory sa v tej seckii zobrazi)

- 