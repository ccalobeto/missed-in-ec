# updated chart in [this repo](https://github.com/ccalobeto/missed-ec).

# Análisis del crimen en Ecuador relacionado a la desaparición de personas

El presente repositorio muestra el proceso de preparación, transformación y visualización de los datos sobre las desapariciones en el vecino país del Ecuador en el 2023.  

La data se obtuvo de la [plataforma de datos abiertos del Ecuador](https://www.datosabiertos.gob.ec/dataset/personas-desaparecidas) y corresponde a enero-septiembre del 2023. 

Este archivo es luego preparado en R y sus hallagos visualizados en la web.

## Transformación
Una vez descargado el csv, los datos son transformados en R en el siguiente script [missed_ec.R](https://github.com/ccalobeto/missed-in-ec/blob/master/src/nb/missed_ec.R). Los archivos preparados se encuentran [aquí](https://github.com/ccalobeto/missed-in-ec/tree/master/src/nb/data/output).  

## Visualización
Se usó la libreria de visualización d3.js para mostrar los hallazgos de la data. En el caso del choropleth se usó como fondo la cartografía del Ecuador ubicado en el siguiente enlace [ec-atlas](https://github.com/ccalobeto/ec-atlas.git).
