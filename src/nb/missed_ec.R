library(tidyverse)
library(ggplot2)

# import scraped datasets
df_ <- read_csv2("data/out/mdg_personasdesaparecidas_pm_2023_enero_mayo.csv",
                 col_names = c("provincia", "latitud", "longitud", "edad", "sexo", 
                               "motivo_desaparicion", "motivo_desaparicion_obs",
                               "fecha_desaparicion", "situacion_actual",
                               "fecha_localizacion"),
                 skip = 1,)
tipologia <- read_csv("data/support/tipologia.csv")
# do some preparation
df <- df_
df$edad <- as.integer(df$edad)
df$motivo_desaparicion_obs[df$motivo_desaparicion_obs == "FISCAL\xcdA"] <- "FISCALIA"
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
                    include.lowest=TRUE)
output <- merge(x = df, y = tipologia, by = "motivo_desaparicion_obs", all.x = TRUE)
# visualization
output %>% ggplot(aes(situacion_actual, days_gone)) + geom_boxplot()
mean_days_gone <- mean(output$days_gone, na.rm = TRUE)

write.csv(df, "data/out/output.csv", row.names = FALSE)


