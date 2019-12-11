--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `questionnaires`
--

LOCK TABLES `questionnaires` WRITE;
/*!40000 ALTER TABLE `questionnaires` DISABLE KEYS */;
INSERT INTO `questionnaires` VALUES (1),(2),(3);
/*!40000 ALTER TABLE `questionnaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'Quel film souhaitez vous que les lyceens et apprentis de la Region voient l annee prochaine et pourquoi ?',1),(2,'Quel est le premier jeu video auquel vous avez joue et quel souvenir en avez vous ?',1),(3,'Quel est votre jeu video prefere et pourquoi ?',1),(4,'Le dernier film que vous avez regarde et pourquoi',1),(5,'Quel est votre film prefere et pourquoi ?',1);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;