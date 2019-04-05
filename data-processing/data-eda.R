library(tidyverse)
library(jsonlite)
library(corrgram)



# ---------------------------------------------------------
# load democracy index data
democracyIndex <- read_json("../webpack/dist/data/democracy-index.json", simplifyVector = TRUE)
religion <- read_json("../webpack/dist/data/religion.json", simplifyVector = TRUE)

data_wide <- read_json("../webpack/dist/data/data_wide.json", simplifyVector = TRUE)
data_long <- read_json("../webpack/dist/data/data_long.json", simplifyVector = TRUE)
data_long <- arrange(data_long, desc(demScore))



# ---------------------------------------------------------
# calculate percents

# normalize as percent of all religions
data_wide$christianPct <- data_wide$christian / data_wide$allReligions
data_wide$muslimPct <- data_wide$muslim / data_wide$allReligions
data_wide$unaffiliatedPct <- data_wide$unaffiliated / data_wide$allReligions
data_wide$hinduPct <- data_wide$hindu / data_wide$allReligions
data_wide$buddhistPct <- data_wide$buddhist / data_wide$allReligions
data_wide$folkReligionPct <- data_wide$folkReligion / data_wide$allReligions
data_wide$otherReligionPct <- data_wide$otherReligion / data_wide$allReligions
data_wide$jewishPct <- data_wide$jewish / data_wide$allReligions


# ---------------------------------------------------------
# exmaine correlations

# plot correlation of religions composition against democracy index factors
pctCols <- c(
  "demScore",
  "demPluralism",
  "demFunctioning",
  "demParticipation",
  "demCulture",
  "demCivil",
  "christianPct",
  "muslimPct",
  "unaffiliatedPct",
  "hinduPct",
  "buddhistPct",
  "folkReligionPct",
  "otherReligionPct",
  "jewishPct"
)

corrgram(data_wide[,pctCols], upper.panel=panel.pts, lower=panel.pie, main="Correlation by Composition (Percent)")


# plot correlation of religions population against democracy index factors
popCols <- c(
  "demScore",
  "demPluralism",
  "demFunctioning",
  "demParticipation",
  "demCulture",
  "demCivil",
  "christian",
  "muslim",
  "unaffiliated",
  "hindu",
  "buddhist",
  "folkReligion",
  "otherReligion",
  "jewish"
)

corrgram(data_wide[,popCols], upper.panel=panel.pts, lower=panel.pie, main="Correlation by Population")



# ---------------------------------------------------------
# plots

# plot all countries ordered by democracy index score
ggplot(data_wide, aes(x=reorder(country, demScore), y=demScore, fill=demCategory)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="All Countries Orded by Democracy Index Score", x="Country", y="Democracy Index Rating")



# show all countries sorted by region
ggplot(data_wide, aes(x=reorder(country, region), y=demScore, fill=demCategory)) +
  geom_bar(stat="identity") +
  coord_flip() + 
  labs(title="All Countries Orded by Democracy Index Sorted by Region", x="Country", y="Democracy Index Rating")



# show democracy by majority muslim countries
d.muslim <- subset(data_wide, muslim > 0.5)

ggplot(d.muslim, aes(x=reorder(country, demScore), y=demScore, fill=demCategory)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="> 50% Muslim Countries Orded by Democracy Index", x="Country", y="Democracy Index Rating")


# show democracy index by majority christian countries
d.christian <- subset(data_wide, christian > 0.5)

ggplot(d.christian, aes(x=reorder(country, demScore), y=demScore, fill=demCategory)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="> 50% Christian Countries Orded by Democracy Index", x="Country", y="Democracy Index Rating")


# show all countries ordered by muslim population
ggplot(d.count, aes(x=reorder(Country, Muslims), y=Muslims, fill=Category)) +
  geom_bar(stat="identity") +
  coord_flip() +
  labs(title="All countries orded by Muslim Population", x="Country", y="Muslim Population")



# total christians by democracy index category
christian <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","christian")])

ggplot(christian, aes(x=factor(demCategory), y=christian)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Christians by Index Cateogy")



# total muslims by democracy index category
muslim <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","muslim")])

ggplot(muslim, aes(x=factor(demCategory), y=muslim)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Muslims by Index Cateogy")



# total hindus by democracy index category
hindu <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","hindu")])

ggplot(hindu, aes(x=factor(demCategory), y=hindu)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Hindus by Index Cateogy")



# total other religions by democracy index category
other <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","otherReligion")])

ggplot(other, aes(x=factor(demCategory), y=otherReligion)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Othe Religions by Index Cateogy")



# total other religions by democracy index category
unaffiliated <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","unaffiliated")])

ggplot(unaffiliated, aes(x=factor(demCategory), y=unaffiliated)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Unaffialited by Index Cateogy")



# folk religions by democracy index category
folk <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","folkReligion")])

ggplot(folk, aes(x=factor(demCategory), y=folkReligion)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Folk Religions by Index Cateogy")



# buddhists by democracy index category
buddhist <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","buddhist")])

ggplot(buddhist, aes(x=factor(demCategory), y=buddhist)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Buddhists by Index Cateogy")



# jews by democracy index category
jewish <- aggregate(. ~ demCategory, sum, data=data_wide[,c("demCategory","jewish")])

ggplot(jewish, aes(x=factor(demCategory), y=jewish)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Jews by Index Cateogy")



# plot religion by full democracy
fullDemocracy <- aggregate(. ~ religion, sum, data=data_long[data_long$demCategory=="Full democracy",c("religion","count")])

ggplot(fullDemocracy, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Full Democracy")



# plot religion by flawed democracy
flawedDemocracy <- aggregate(. ~ religion, sum, data=data_long[data_long$demCategory=="Flawed democracy",c("religion","count")])

ggplot(flawedDemocracy, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Flawed Democracy")



# plot religion by hybrid regime
hybridRegime <- aggregate(. ~ religion, sum, data=data_long[data_long$demCategory=="Hybrid regime",c("religion","count")])

ggplot(hybridRegime, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Hybrid Regime")



# plot religion by authoritarian
authoritarian <- aggregate(. ~ religion, sum, data=data_long[data_long$demCategory=="Authoritarian",c("religion","count")])

ggplot(authoritarian, aes(x=religion, y=count)) +
  geom_bar(stat="identity") +
  scale_y_continuous(labels = scales::comma, limits=c(NA, 1000000000)) +
  coord_flip() +
  labs(title = "Religion by Authoritarian")



