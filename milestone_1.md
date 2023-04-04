# Milestone 1

By the Group _In Viz Veritas_:
Hannah Casey (300981), Zoé Jeandupeux, Erik A. Wengle (297099)

## Dataset - Travel Guides from 1550 to 1930

The dataset we are working on is a collection of old travel guides for Italy from the rare books collection of the Bibliotheca Hertziana in Rome (https://www.biblhertz.it/it/home). 
The collection contains around 800 documents in several languages from the years 1550 up until 1930. 
They are sparsely illustrated and contain a lot of recognizable place names. 
All of them have been recently digitized, but only around 80 have also been transcribed using Transkribus (https://readcoop.eu/transkribus/?sc=Transkribus). Tranksribus is a AI suuported platforms for text recognition and transcriptions. 

The textual data we scraped from Transkribus and the metadata obtained from the Bibliotheca Hertziana, gives us access to data that can be of interest for a vizualisation. We have access to metadata like title and author, year and place of publication, language of the text, and several other columns that might be of lesser interest, such as format of the document. Since the texts are in several languages, one of the potential challenges is how to use NLP techniques on the text to extract for example place names and sentiment. 

While the quality of the book transcriptions is sufficiently high, our dataset will require a large amount of preprocessing in order to extract data of interest.
The fact that these books were written in different languages, some of them being extinct such as old italian or old german, further complexifies the task. 

Nonetheless, we do want to stick to this problematic as it is a topic of great interest to us. As a group of experienced data scientists we will gladly tackle the extra challenge of the possibly cumbersome preprocessing.


## Problematic


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

As far as the current director of the library of the Bibliotheca Hertziana knows, there has been no work done yet on the collection of travel guides for Italy. One of the former directors of the library, Ludwig Schudt, worked on the collection of early modern guide books for Rome and Italy and published his work in the 1930s. (HANNAH REF TO HIS WORK?, WHAT HAVE THEY DONE WITH THEIR DATA?)
As of yet here has been no work done yet to visualize the text and appearance of placenames and associated sentiment, which makes the task even more intriguing. 

- The Mapping Colonial Americas Publishing Project(http://cds.library.brown.edu/mapping-genres/): Mapping of published books from the Brown library
- Atlas of early printing(http://atlas.lib.uiowa.edu/#): Specifically the trade routes are a nice reference, in case we want to vizualise the travel routes
- 
