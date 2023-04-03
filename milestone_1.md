# Milestone 1

By the Group _In Viz Veritas_:
Hannah Casey, Zoé Jeandupeux, Erik A. Wengle (297099)

## Dataset

TODO: hannah can you further specify the source of these books? Of course I can no problem at all :)
The dataset we're working on is a collection of rare travel guides form the rare books collection of the Bibliotheca Hertziana in Rome. The collection contains around 800 documents in several languages from the years 1550 up until 1930. They are sparsely illustrated and contain a lot of recognizable place names. Of the 800 so far only around 90 have been digitzed and also transcribed, meaning that we can access the metadata and the text of these documents.

We scraped a total of 78 distinct books from various years, written in different languages. While the quality of the book transcriptions is sufficiently high, our dataset will require a large amount of pre-processing in order to extract data of interest (e.g. visited locations, overall perception of the visited places). The fact that these books were written in different languages, some of them being extinct such as old italian or old german, further complexifies the task. Nonetheless, we do want to stick to this problematic as it is a topic of great interest to us. As a group experienced data scientists we will gladly tackle the extra challenge of the possibly cumbersome preprocessing.

## Problematic

TODO: Who wants to do this? Not me (Zoe : I can do it)

## Exploratory Data Analysis

After a brief exploratory data analysis, we found the following:

- Number of books: 78

- Page count per book:
  | Min | Max |  Mean   | Std_dev |
  | --- | --- |   ---   |   ---   |
  | 102 | 1250 | 383.86 | 193.15  |

- Word count per book:
  | Min  |   Max   |   Mean    |  Std_dev  |
  | ---  |   ---   |    ---    |    ---    |
  | 2103 | 3335171 | 466964.44 | 450411.14 |

- Languages featured:
    | Language    | Count |
    | ----------- | ----- |
    | English     | 37    |
    | French      | 16    |
    | German      | 11    |
    | Old Italian | 10    |
    | Latin       | 2     |
    | Dutch       | 1     |
    | Unknown     | 1     |

- To Do:
  - Different Locations featured: **HARD**
  - Valence/Arousal of the writer: **HARD**
  - Average length of a page: Not interesting?

## Related Work

TODO: Who wants to do this? Not me (I think Hannah could ask to the max planck institute)
