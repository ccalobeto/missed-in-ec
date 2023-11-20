library(tidyverse)
library(ggplot2)

# import scraped datasets
# https://www.datosabiertos.gob.ec/dataset/personas-desaparecidas
# "https://datosabiertos.gob.ec/dataset/bb80c831-a3e6-4be2-b248-7ef0f6ccaedc/resource/7329fc75-94c3-4611-94ee-d84cd18fef1b/download/mdi_personasdesaparecidas_pm_2023_enero_septiembre.csv"
missed_file <- "data/input/mdi_personasdesaparecidas_pm_2023_enero_septiembre.csv"
columns <- c("provincia", "latitud", "longitud", "edad", "sexo",
             "motivo_desaparicion", "motivo_desaparicion_obs",
             "fecha_desaparicion", "situacion_actual", "fecha_localizacion")
df_ <- read_csv2(missed_file, col_names = columns, skip = 1)
# do some cleaning and preparation
df <- df_
df$edad <- as.integer(df$edad)
filter_obs <- df$motivo_desaparicion_obs == "FISCAL\xcdA"
df$motivo_desaparicion_obs[filter_obs] <- "FISCALIA"
df$fecha_localizacion[df$fecha_localizacion == "SIN_DATO"] <- NA
df$fecha_desaparicion <- as.Date(df$fecha_desaparicion, format = "%d/%m/%Y")
df$fecha_localizacion <- as.Date(df$fecha_localizacion, format = "%d/%m/%Y")
max_date <- max(df$fecha_localizacion, na.rm = TRUE) + 1
df$year <- year(df$fecha_desaparicion)
df$month <- month(df$fecha_desaparicion)
df$day <- day(df$fecha_desaparicion)
df$days_gone <- df$fecha_localizacion - df$fecha_desaparicion
df$age_group <- cut(df$edad,
                    c(0, 12, 17, 35, 64, Inf),
                    c("12 o menos", "13-17", "18-35", "36-64", "65 o mas"),
                    include.lowest = TRUE)
# test pre-visualization
df %>%
  filter(situacion_actual != "DESAPARECIDO") %>%
  ggplot(aes(situacion_actual, days_gone)) + geom_boxplot()
mean_days_gone <- mean(df$days_gone, na.rm = TRUE)

write.csv(df, "data/output/missed_ec_prep.csv", row.names = FALSE)