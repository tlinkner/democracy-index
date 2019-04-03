library(tidyverse)
library(readxl)
library(jsonlite)



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
# load religion data
# https://www.pewforum.org/2015/04/02/religious-projection-table/

religion <-  read_excel("raw-data/Religious_Composition_by_Country_2010-2050.xlsx", col_names = TRUE)

# remove excel id column
religion$row_number <- NULL

# remove level key
religion$level <- NULL

# remove nation foreign key
religion$Nation_fk <- NULL

# only use level 1, not regional data
religion <- religion[religion$level == 1,]

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



# ---------------------------------------------------------
# merge

data_wide <- merge(democracyIndex, religion, by="country")

startCol <- which(colnames(data_wide) == "christian")
endCol <- which(colnames(data_wide) == "jewish")

data_long <- gather(data_wide, key="religion", value="count",  startCol:endCol, factor_key=TRUE)



# ---------------------------------------------------------
# save files

write_json(democracyIndex,"../webpack/dist/data/democracy-index.json")
write_json(religion,"../webpack/dist/data/religion.json")

write_json(data_wide,"../webpack/dist/data/data_wide.json")
write_json(data_long,"../webpack/dist/data/data_long.json")







