library(tidyverse)
library(readxl)
library(jsonlite)
library(plyr)
library(imputeTS)




# ---------------------------------------------------------
# load democracy index data
# https://www.eiu.com/topic/democracy-index

democracyIndex <- read_csv("raw-data/democracy_index_2018.csv")

# set colnames
names(democracyIndex) <- c(
  "demRank",
  "country",
  "demScore", 
  "demPluralism", 
  "demFunctioning", 
  "demParticipation", 
  "demCulture", 
  "demCivil", 
  "demCategory"  
)



# ---------------------------------------------------------
# geocode data
# https://opendata.socrata.com/dataset/Country-List-ISO-3166-Codes-Latitude-Longitude/mnkm-8ram/data

geoCode <- read_csv("raw-data/Country_List_ISO_3166_Codes_Latitude_Longitude.csv")
# remove unwanted columns
geoCode$`Alpha-2 code` <- NULL
geoCode$`Numeric code` <- NULL
geoCode$Icon <- NULL

# set names
names(geoCode) <- c("country","code","lat","lng")

# find country names that do not match
length(setdiff(democracyIndex$country, geoCode$country))

# 18 need updating
replaceCountries <- c(
  "Korea, Republic of" = "South Korea",
  "Taiwan, Province of China" ="Taiwan Republic of China (Taiwan)",
  "Macedonia, the former Yugoslav Republic of" = "North Macedonia",
  "Moldova, Republic of" = "Moldova",
  "Bolivia, Plurinational State of" = "Bolivia",
  "Palestinian Territory, Occupied" = "Palestine",
  "Côte d'Ivoire" = "Ivory Coast",
  "Venezuela, Bolivarian Republic of" = "Venezuela",
  "Viet Nam" = "Vietnam",
  "Russian Federation" = "Russia",
  "Iran, Islamic Republic of" = "Iran",
  "Lao People's Democratic Republic" = "Laos",
  "Libyan Arab Jamahiriya" = "Libya",
  "Congo, the Democratic Republic of the" = "Democratic Republic of the Congo",
  "Tanzania, United Republic of" = "Tanzania",
  "Congo" = "Republic of the Congo",
  "Syrian Arab Republic" = "Syria",
  "Korea, Democratic People's Republic of" = "North Korea"
)

geoCode$country <- revalue(geoCode$country, replaceCountries)

setdiff(democracyIndex$country, geoCode$country)
# no diffences, OK to merge

# merge with democracyIndex
democracyIndex <- merge(democracyIndex, geoCode, by="country", all.y = FALSE)



# ---------------------------------------------------------
# load religion data
# https://www.pewforum.org/2015/04/02/religious-projection-table/

religion <-  read_excel("raw-data/Religious_Composition_by_Country_2010-2050.xlsx", col_names = TRUE)

# remove excel id column
religion$row_number <- NULL

# only use level 1, not regional data
religion <- religion[religion$level == 1,]

# remove level key
religion$level <- NULL

# remove nation foreign key
religion$Nation_fk <- NULL

# only use 2010 values
religion$Year <- as.numeric(religion$Year)
religion <- religion[religion$Year == 2010,]
religion$Year <- NULL

# clean numbers
religion$Christians <- str_replace_all(religion$Christians, ",","") %>% as.numeric
religion$Muslims <- str_replace_all(religion$Muslims, ",","") %>% as.numeric
religion$Unaffiliated <- str_replace_all(religion$Unaffiliated, ",","") %>% as.numeric
religion$Hindus <- str_replace_all(religion$Hindus, ",","") %>% as.numeric
religion$Buddhists <- str_replace_all(religion$Buddhists, ",","") %>% as.numeric
religion$`Folk Religions` <- str_replace_all(religion$`Folk Religions`, ",","") %>% as.numeric
religion$`Other Religions` <- str_replace_all(religion$`Other Religions`, ",","") %>% as.numeric
religion$Jews <- str_replace_all(religion$Jews, ",","") %>% as.numeric
religion$`All Religions` <- str_replace_all(religion$`All Religions`, ",","") %>% as.numeric

# set colnames
names(religion) <- c(
  "region",
  "country", 
  "christian", 
  "muslim", 
  "unaffiliated", 
  "hindu", 
  "buddhist", 
  "folkReligion", 
  "otherReligion", 
  "jewish", 
  "allReligions"  
)

setdiff(democracyIndex$country, religion$country)
# a few to recode

replaceCountries <- c(
  "Bosnia-Herzegovina" = "Bosnia and Herzegovina",
  "Burma (Myanmar)" = "Myanmar",
  "Republic of Macedonia" = "North Macedonia",
  "Palestinian territories" = "Palestine",
  "Taiwan" = "Taiwan Republic of China (Taiwan)"
)

religion$country <- revalue(religion$country, replaceCountries)

setdiff(democracyIndex$country, religion$country)
# no differences, OK to merge



# ---------------------------------------------------------
# merge
# most recent update for D3 final

data_wide <- merge(democracyIndex, religion, by="country")

data_wide <- data_wide[,c(
  "country",
  "demScore",
  "demCategory",
  "christian",
  "muslim",
  "unaffiliated",
  "buddhist",
  "folkReligion",
  "otherReligion",
  "jewish",
  "allReligions"
)]

names(data_wide) <- c(
  "country",
  "indexScore",
  "indexCategory",
  "christian",
  "muslim",
  "unaffiliated",
  "buddhist",
  "folkReligion",
  "otherReligion",
  "jewish",
  "allReligions"
)

# if diff is 0, OK to merge
setdiff(data_wide$country, geoCode$country)

data_wide <- merge(data_wide, geoCode, by="country", all.y = FALSE)

data_wide$code <- tolower(data_wide$code)

# impute empty values as 0
data_wide <- na.replace(data_wide, 0)

startCol <- which(colnames(data_wide) == "christian")
endCol <- which(colnames(data_wide) == "jewish")

data_long <- gather(data_wide, key="religion", value="count",  startCol:endCol, factor_key=TRUE)

# rename specific column
names(data_long)[names(data_long) == 'count'] <- 'religionPop'

data_long$religionPct = data_long$religionPop / data_long$allReligions



# ---------------------------------------------------------
# save files

write_json(data_long, "democracy_religion_long.json")

write_json(data_wide, "democracy_religion_wide.json")





