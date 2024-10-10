#!/bin/bash
conv() {
  ./convert.py -c 2 $1 > skins/$2-2.css
  ./convert.py -c 4 $1 > skins/$2-4.css
  ./convert.py -c 8 $1 > skins/$2-8.css
}
conv palettes/Alpine.dp alpine
conv palettes/Arizona.dp arizona
conv palettes/BeigeRose.dp beige-rose
conv palettes/Broica.dp broica
conv palettes/Cabernet.dp cabernet
conv palettes/Camouflage.dp camouflage
conv palettes/Charcoal.dp charcoal
conv palettes/Chocolate.dp chocolate
conv palettes/Cinnamon.dp cinnamon
conv palettes/Clay.dp clay
conv palettes/Crimson.dp crimson
conv palettes/DarkGold.dp dark-gold
conv palettes/Default.dp default
conv palettes/Delphinium.dp delphinium
conv palettes/Desert.dp desert
conv palettes/Golden.dp golden
conv palettes/Grass.dp grass
conv palettes/GrayScale.dp gray-scale
conv palettes/Lilac.dp lilac
conv palettes/Mustard.dp mustard
conv palettes/Neptune.dp neptune
conv palettes/NorthernSky.dp northern-sky
conv palettes/Nutmeg.dp nutmeg
conv palettes/Olive.dp olive
conv palettes/Orchid.dp orchid
conv palettes/PBNJ.dp pbnj
conv palettes/Sand.dp sand
conv palettes/SantaFe.dp santa-fe
conv palettes/Savannah.dp savannah
conv palettes/SeaFoam.dp sea-foam
conv palettes/SkyRed.dp sky-red
conv palettes/SoftBlue.dp soft-blue
conv palettes/SouthWest.dp south-west
conv palettes/Summer.dp summer
conv palettes/Tundra.dp tundra
conv palettes/Urchin.dp urchin
conv palettes/Wheat.dp wheat
./convert.py -c 8 palettes/Black.dp > skins/black.css
./convert.py -c 8 palettes/BlackWhite.dp > skins/black-white.css
./convert.py -c 8 palettes/White.dp > skins/white.css
./convert.py -c 8 palettes/WhiteBlack.dp > skins/white-black.css

