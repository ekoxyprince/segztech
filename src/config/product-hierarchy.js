const productHierarchy = {
  "phones": {
    "name": "Phones",
    "brands": {
      "Apple": {
        "models": {
          "iPhone 16": {
            "series": [
              "iPhone 16",
              "iPhone 16 Plus",
              "iPhone 16 Pro",
              "iPhone 16 Pro Max"
            ],
            "specs": {
              "os": "iOS 18"
            }
          },
          "iPhone 15": {
            "series": [
              "iPhone 15",
              "iPhone 15 Plus",
              "iPhone 15 Pro",
              "iPhone 15 Pro Max"
            ],
            "specs": {
              "os": "iOS 17"
            }
          },
          "iPhone 14": {
            "series": [
              "iPhone 14",
              "iPhone 14 Plus",
              "iPhone 14 Pro",
              "iPhone 14 Pro Max"
            ],
            "specs": {
              "os": "iOS 16"
            }
          },
          "iPhone 13": {
            "series": [
              "iPhone 13",
              "iPhone 13 Mini",
              "iPhone 13 Pro",
              "iPhone 13 Pro Max"
            ],
            "specs": {
              "os": "iOS 15"
            }
          },
          "iPhone SE": {
            "series": [
              "iPhone SE 3rd Gen (2022)",
              "iPhone SE 2nd Gen (2020)"
            ],
            "specs": {
              "os": "iOS 15"
            }
          }
        }
      },
      "Samsung": {
        "models": {
          "Galaxy S": {
            "series": [
              "Galaxy S24 Ultra",
              "Galaxy S24+",
              "Galaxy S24",
              "Galaxy S23 Ultra",
              "Galaxy S23+",
              "Galaxy S23",
              "Galaxy S22 Ultra",
              "Galaxy S22+",
              "Galaxy S22"
            ],
            "specs": {}
          },
          "Galaxy Z": {
            "series": [
              "Galaxy Z Fold 6",
              "Galaxy Z Fold 5",
              "Galaxy Z Flip 6",
              "Galaxy Z Flip 5",
              "Galaxy Z Fold 4",
              "Galaxy Z Flip 4"
            ],
            "specs": {}
          },
          "Galaxy A": {
            "series": [
              "Galaxy A54",
              "Galaxy A34",
              "Galaxy A25",
              "Galaxy A15",
              "Galaxy A53",
              "Galaxy A33",
              "Galaxy A24",
              "Galaxy A14"
            ],
            "specs": {}
          },
          "Galaxy M": {
            "series": [
              "Galaxy M54",
              "Galaxy M34",
              "Galaxy M14",
              "Galaxy M53",
              "Galaxy M33",
              "Galaxy M13"
            ],
            "specs": {}
          },
          "Galaxy Note": {
            "series": [
              "Galaxy Note 20 Ultra",
              "Galaxy Note 20",
              "Galaxy Note 10+",
              "Galaxy Note 10"
            ],
            "specs": {}
          }
        }
      },
      "Google": {
        "models": {
          "Pixel": {
            "series": [
              "Pixel 9 Pro XL",
              "Pixel 9 Pro",
              "Pixel 9",
              "Pixel 8 Pro",
              "Pixel 8",
              "Pixel 8a",
              "Pixel 7 Pro",
              "Pixel 7",
              "Pixel 7a",
              "Pixel 6 Pro",
              "Pixel 6"
            ],
            "specs": {}
          }
        }
      },
      "OnePlus": {
        "models": {
          "OnePlus 12": {
            "series": [
              "OnePlus 12",
              "OnePlus 12R"
            ],
            "specs": {}
          },
          "OnePlus 11": {
            "series": [
              "OnePlus 11",
              "OnePlus 11R"
            ],
            "specs": {}
          },
          "Nord": {
            "series": [
              "Nord 3",
              "Nord CE 3",
              "Nord 2",
              "Nord CE 2",
              "N30 5G"
            ],
            "specs": {}
          }
        }
      },
      "Xiaomi": {
        "models": {
          "Xiaomi 14": {
            "series": [
              "Xiaomi 14 Ultra",
              "Xiaomi 14 Pro",
              "Xiaomi 14"
            ],
            "specs": {}
          },
          "Xiaomi 13": {
            "series": [
              "Xiaomi 13 Ultra",
              "Xiaomi 13 Pro",
              "Xiaomi 13",
              "Xiaomi 13 Lite"
            ],
            "specs": {}
          },
          "Redmi Note": {
            "series": [
              "Redmi Note 13 Pro+",
              "Redmi Note 13 Pro",
              "Redmi Note 13",
              "Redmi Note 12 Pro+",
              "Redmi Note 12 Pro",
              "Redmi Note 12"
            ],
            "specs": {}
          },
          "POCO": {
            "series": [
              "POCO F6 Pro",
              "POCO F6",
              "POCO X6 Pro",
              "POCO X6",
              "POCO M6 Pro",
              "POCO M6"
            ],
            "specs": {}
          }
        }
      },
      "Oppo": {
        "models": {
          "Find X": {
            "series": [
              "Find X7 Ultra",
              "Find X7 Pro",
              "Find X6 Pro",
              "Find X5 Pro"
            ],
            "specs": {}
          },
          "Reno": {
            "series": [
              "Reno 11 Pro",
              "Reno 11",
              "Reno 10 Pro+",
              "Reno 10 Pro",
              "Reno 8 Pro",
              "Reno 8"
            ],
            "specs": {}
          },
          "A Series": {
            "series": [
              "A79",
              "A58",
              "A38",
              "A18",
              "A78",
              "A58",
              "A17"
            ],
            "specs": {}
          }
        }
      },
      "Vivo": {
        "models": {
          "X Series": {
            "series": [
              "X100 Pro",
              "X100",
              "X90 Pro",
              "X90",
              "X80 Pro",
              "X80"
            ],
            "specs": {}
          },
          "V Series": {
            "series": [
              "V30 Pro",
              "V30",
              "V29 Pro",
              "V29",
              "V27 Pro",
              "V27"
            ],
            "specs": {}
          },
          "Y Series": {
            "series": [
              "Y100",
              "Y78+",
              "Y36",
              "Y27",
              "Y22",
              "Y17s"
            ],
            "specs": {}
          }
        }
      },
      "Motorola": {
        "models": {
          "Edge": {
            "series": [
              "Edge 50 Pro",
              "Edge 40 Pro",
              "Edge 40",
              "Edge 30 Ultra",
              "Edge 30 Pro",
              "Edge 30"
            ],
            "specs": {}
          },
          "Moto G": {
            "series": [
              "Moto G84",
              "Moto G73",
              "Moto G62",
              "Moto G54",
              "Moto G34",
              "Moto G24"
            ],
            "specs": {}
          },
          "Razr": {
            "series": [
              "Razr 40 Ultra",
              "Razr 40",
              "Razr 2022",
              "Razr 5G"
            ],
            "specs": {}
          }
        }
      },
      "Realme": {
        "models": {
          "GT": {
            "series": [
              "GT 6",
              "GT 5 Pro",
              "GT 5",
              "GT 3",
              "GT 2 Pro",
              "GT 2"
            ],
            "specs": {}
          },
          "Number Series": {
            "series": [
              "Realme 12 Pro+",
              "Realme 12 Pro",
              "Realme 12",
              "Realme 11 Pro+",
              "Realme 11 Pro",
              "Realme 11"
            ],
            "specs": {}
          },
          "C Series": {
            "series": [
              "C67",
              "C55",
              "C53",
              "C51",
              "C36",
              "C30"
            ],
            "specs": {}
          }
        }
      },
      "Huawei": {
        "models": {
          "P Series": {
            "series": [
              "P60 Pro",
              "P60",
              "P50 Pro",
              "P50",
              "P40 Pro",
              "P40"
            ],
            "specs": {}
          },
          "Mate": {
            "series": [
              "Mate 60 Pro",
              "Mate 60",
              "Mate 50 Pro",
              "Mate 50",
              "Mate 40 Pro"
            ],
            "specs": {}
          },
          "Nova": {
            "series": [
              "Nova 12",
              "Nova 11 Pro",
              "Nova 11",
              "Nova 10 Pro",
              "Nova 10"
            ],
            "specs": {}
          }
        }
      },
      "Tecno": {
        "models": {
          "Camon": {
            "series": [
              "Camon 30 Pro",
              "Camon 30",
              "Camon 20 Pro",
              "Camon 20",
              "Camon 19 Pro"
            ],
            "specs": {}
          },
          "Spark": {
            "series": [
              "Spark 20 Pro+",
              "Spark 20 Pro",
              "Spark 20",
              "Spark 10 Pro",
              "Spark 10"
            ],
            "specs": {}
          },
          "Pova": {
            "series": [
              "Pova 6 Pro",
              "Pova 5 Pro",
              "Pova 5",
              "Pova 4 Pro",
              "Pova 4"
            ],
            "specs": {}
          }
        }
      },
      "Infinix": {
        "models": {
          "Note": {
            "series": [
              "Note 40 Pro",
              "Note 30 Pro",
              "Note 30",
              "Note 12 Pro",
              "Note 12"
            ],
            "specs": {}
          },
          "Hot": {
            "series": [
              "Hot 40 Pro",
              "Hot 40",
              "Hot 30 Pro",
              "Hot 30",
              "Hot 12"
            ],
            "specs": {}
          },
          "Zero": {
            "series": [
              "Zero 30 5G",
              "Zero Ultra",
              "Zero 20",
              "Zero 5G"
            ],
            "specs": {}
          }
        }
      },
      "Nokia": {
        "models": {
          "G Series": {
            "series": [
              "G42",
              "G22",
              "G21",
              "G11",
              "G10"
            ],
            "specs": {}
          },
          "X Series": {
            "series": [
              "XR21",
              "X30",
              "X20",
              "X10"
            ],
            "specs": {}
          },
          "C Series": {
            "series": [
              "C32",
              "C31",
              "C22",
              "C21",
              "C12"
            ],
            "specs": {}
          }
        }
      }
    }
  },
  "laptops": {
    "name": "Laptops",
    "types": [
      "Gaming",
      "Business",
      "Ultrabook",
      "Workstation",
      "2-in-1 Convertible",
      "Budget/Student",
      "Chromebook"
    ],
    "brands": {
      "HP": {
        "types": [
          "Business",
          "Gaming",
          "Ultrabook",
          "2-in-1 Convertible"
        ],
        "models": {
          "EliteBook": {
            "type": "Business",
            "series": [
              "EliteBook 1040 G10",
              "EliteBook 1040 G9",
              "EliteBook 840 G10",
              "EliteBook 840 G9",
              "EliteBook 840 G8",
              "EliteBook 830 G10",
              "EliteBook 830 G9",
              "EliteBook x360 1030 G4",
              "EliteBook x360 1030 G3",
              "EliteBook x360 830 G10",
              "EliteBook x360 830 G9",
              "EliteBook 860 G10",
              "EliteBook 850 G10",
              "EliteBook 850 G9"
            ]
          },
          "ProBook": {
            "type": "Business",
            "series": [
              "ProBook 450 G10",
              "ProBook 450 G9",
              "ProBook 450 G8",
              "ProBook 440 G10",
              "ProBook 440 G9",
              "ProBook 440 G8",
              "ProBook 430 G10",
              "ProBook 430 G9",
              "ProBook x360 435 G10",
              "ProBook x360 435 G9",
              "ProBook 460 G10",
              "ProBook 470 G10"
            ]
          },
          "Pavilion": {
            "type": "Budget/Student",
            "series": [
              "Pavilion 15-eg3000",
              "Pavilion 15-eg2000",
              "Pavilion 14-dv2000",
              "Pavilion 14-dv1000",
              "Pavilion Plus 14-eh1000",
              "Pavilion Plus 14-eh2000",
              "Pavilion x360 14-ek1000",
              "Pavilion x360 14-ek0000"
            ]
          },
          "ENVY": {
            "type": "Ultrabook",
            "series": [
              "ENVY x360 15-fe1000",
              "ENVY x360 15-fe0000",
              "ENVY x360 13-bf1000",
              "ENVY x360 13-bf0000",
              "ENVY 16-h1000",
              "ENVY 16-h0000",
              "ENVY 14-ep1000",
              "ENVY 14-ep0000"
            ]
          },
          "Spectre": {
            "type": "Ultrabook",
            "series": [
              "Spectre x360 16-aa1000",
              "Spectre x360 16-aa0000",
              "Spectre x360 14-ef2000",
              "Spectre x360 14-ef1000",
              "Spectre x360 13.5-ef1000"
            ]
          },
          "Omen": {
            "type": "Gaming",
            "series": [
              "Omen 16-wf1000",
              "Omen 16-wf0000",
              "Omen 16-n0000",
              "Omen 17-ck2000",
              "Omen 17-ck1000",
              "Omen Transcend 14-fb0000",
              "Omen Transcend 16-u0000"
            ]
          },
          "Victus": {
            "type": "Gaming",
            "series": [
              "Victus 16-s1000",
              "Victus 16-s0000",
              "Victus 15-fa1000",
              "Victus 15-fa0000"
            ]
          },
          "ZBook": {
            "type": "Workstation",
            "series": [
              "ZBook Studio G10",
              "ZBook Studio G9",
              "ZBook Power G10",
              "ZBook Power G9",
              "ZBook Fury 16 G10",
              "ZBook Fury 16 G9",
              "ZBook Fury 17 G10",
              "ZBook Firefly 16 G10",
              "ZBook Firefly 14 G10"
            ]
          }
        }
      },
      "Dell": {
        "types": [
          "Business",
          "Gaming",
          "Ultrabook",
          "Workstation",
          "2-in-1 Convertible"
        ],
        "models": {
          "Latitude": {
            "type": "Business",
            "series": [
              "Latitude 7450",
              "Latitude 7440",
              "Latitude 7430",
              "Latitude 7350",
              "Latitude 7340",
              "Latitude 7330",
              "Latitude 5540",
              "Latitude 5530",
              "Latitude 5520",
              "Latitude 5440",
              "Latitude 5430",
              "Latitude 5350",
              "Latitude 5340",
              "Latitude 5330",
              "Latitude 7450 2-in-1",
              "Latitude 7350 2-in-1",
              "Latitude 7320 2-in-1",
              "Latitude 7420 2-in-1",
              "Latitude 9440 2-in-1",
              "Latitude 9450 2-in-1"
            ]
          },
          "Inspiron": {
            "type": "Budget/Student",
            "series": [
              "Inspiron 15 3530",
              "Inspiron 15 3520",
              "Inspiron 15 3511",
              "Inspiron 14 5430",
              "Inspiron 14 5425",
              "Inspiron 14 5420",
              "Inspiron 16 5630",
              "Inspiron 16 5620",
              "Inspiron 14 Plus 7430",
              "Inspiron 14 Plus 7420",
              "Inspiron 16 Plus 7630",
              "Inspiron 16 Plus 7620",
              "Inspiron 14 2-in-1 7430",
              "Inspiron 14 2-in-1 7420",
              "Inspiron 16 2-in-1 7630"
            ]
          },
          "XPS": {
            "type": "Ultrabook",
            "series": [
              "XPS 13 9340",
              "XPS 13 9315",
              "XPS 13 9310",
              "XPS 13 Plus 9320",
              "XPS 13 Plus 9315",
              "XPS 14 9440",
              "XPS 15 9530",
              "XPS 15 9520",
              "XPS 15 9510",
              "XPS 17 9730",
              "XPS 17 9720",
              "XPS 17 9710"
            ]
          },
          "Precision": {
            "type": "Workstation",
            "series": [
              "Precision 3581",
              "Precision 3571",
              "Precision 3561",
              "Precision 5480",
              "Precision 5470",
              "Precision 5680",
              "Precision 5670",
              "Precision 5570",
              "Precision 7680",
              "Precision 7780",
              "Precision 7770",
              "Precision 7560"
            ]
          },
          "Alienware": {
            "type": "Gaming",
            "series": [
              "Alienware m18 R2",
              "Alienware m18 R1",
              "Alienware m16 R2",
              "Alienware m16 R1",
              "Alienware x16 R2",
              "Alienware x16 R1",
              "Alienware x14 R2",
              "Alienware x14 R1",
              "Alienware Area-51m R2"
            ]
          },
          "G Series": {
            "type": "Gaming",
            "series": [
              "G15 5530",
              "G15 5525",
              "G15 5520",
              "G15 5515",
              "G15 5511",
              "G16 7630",
              "G16 7620"
            ]
          },
          "Vostro": {
            "type": "Business",
            "series": [
              "Vostro 15 3530",
              "Vostro 15 3520",
              "Vostro 14 5430",
              "Vostro 14 5425",
              "Vostro 16 5630"
            ]
          }
        }
      },
      "Lenovo": {
        "types": [
          "Business",
          "Gaming",
          "Ultrabook",
          "Workstation",
          "2-in-1 Convertible",
          "Budget/Student",
          "Chromebook"
        ],
        "models": {
          "ThinkPad": {
            "type": "Business",
            "series": [
              "ThinkPad X1 Carbon Gen 11",
              "ThinkPad X1 Carbon Gen 10",
              "ThinkPad X1 Carbon Gen 9",
              "ThinkPad X1 Yoga Gen 8",
              "ThinkPad X1 Yoga Gen 7",
              "ThinkPad X1 Nano Gen 3",
              "ThinkPad X1 Nano Gen 2",
              "ThinkPad X13 Gen 4",
              "ThinkPad X13 Gen 3",
              "ThinkPad X13 Gen 2",
              "ThinkPad X13 Yoga Gen 4",
              "ThinkPad X13 Yoga Gen 3",
              "ThinkPad T14s Gen 4",
              "ThinkPad T14s Gen 3",
              "ThinkPad T14s Gen 2",
              "ThinkPad T14 Gen 4",
              "ThinkPad T14 Gen 3",
              "ThinkPad T14 Gen 2",
              "ThinkPad T14 Gen 4 AMD",
              "ThinkPad T14 Gen 3 AMD",
              "ThinkPad T16 Gen 2",
              "ThinkPad T16 Gen 1",
              "ThinkPad T14p Gen 1",
              "ThinkPad P1 Gen 6",
              "ThinkPad P1 Gen 5",
              "ThinkPad P16s Gen 2",
              "ThinkPad P16s Gen 1",
              "ThinkPad P16 Gen 2",
              "ThinkPad P16 Gen 1",
              "ThinkPad P14s Gen 4",
              "ThinkPad P14s Gen 3",
              "ThinkPad L14 Gen 4",
              "ThinkPad L14 Gen 3",
              "ThinkPad L15 Gen 4",
              "ThinkPad L15 Gen 3",
              "ThinkPad L13 Yoga Gen 4",
              "ThinkPad L13 Yoga Gen 3",
              "ThinkPad L13 Gen 4",
              "ThinkPad L13 Gen 3",
              "ThinkPad E14 Gen 5",
              "ThinkPad E14 Gen 4",
              "ThinkPad E16 Gen 1",
              "ThinkPad E15 Gen 4"
            ]
          },
          "ThinkBook": {
            "type": "Business",
            "series": [
              "ThinkBook 14 Gen 6",
              "ThinkBook 14 Gen 5",
              "ThinkBook 14 Gen 4",
              "ThinkBook 16 Gen 6",
              "ThinkBook 16 Gen 5",
              "ThinkBook 16 Gen 4",
              "ThinkBook 14s Yoga Gen 2",
              "ThinkBook 14 Yoga Gen 8",
              "ThinkBook 16p Gen 4",
              "ThinkBook 13x Gen 4"
            ]
          },
          "Legion": {
            "type": "Gaming",
            "series": [
              "Legion Pro 7i Gen 8",
              "Legion Pro 7i Gen 7",
              "Legion Pro 5i Gen 8",
              "Legion Pro 5i Gen 7",
              "Legion 5i Gen 8",
              "Legion 5 Gen 7",
              "Legion Slim 5 Gen 8",
              "Legion Slim 7 Gen 7",
              "Legion 7i Gen 7",
              "Legion 7 Gen 6",
              "Legion 5 Pro 16ACH6H",
              "Legion 5 Pro 16IAH7H",
              "Legion Y9000P",
              "Legion Y7000P",
              "LOQ 15IRH8",
              "LOQ 15IAX9",
              "LOQ 16APH8"
            ]
          },
          "IdeaPad": {
            "type": "Budget/Student",
            "series": [
              "IdeaPad Slim 5 14IRL8",
              "IdeaPad Slim 5 16IRL8",
              "IdeaPad 3 15IAU7",
              "IdeaPad 3 15ITL6",
              "IdeaPad 3 14IAU7",
              "IdeaPad Flex 5 14IRL8",
              "IdeaPad Flex 5 16IRL8",
              "IdeaPad Flex 3 14IAU7",
              "IdeaPad Flex 3 Chromebook",
              "IdeaPad 1 15IGL7",
              "IdeaPad 1 14IGL7",
              "IdeaPad Gaming 3 15ACH6",
              "IdeaPad Gaming 3 15ARH7",
              "IdeaPad Slim 7 14IRL8",
              "IdeaPad Slim 7 16IRL8"
            ]
          },
          "Yoga": {
            "type": "2-in-1 Convertible",
            "series": [
              "Yoga 9i 14IRL8",
              "Yoga 9i 14IMH9",
              "Yoga 7i 16IRL8",
              "Yoga 7i 14IRL8",
              "Yoga 7 2-in-1 16IMH9",
              "Yoga 7 2-in-1 14IMH9",
              "Yoga Slim 7 Pro 14ARH8",
              "Yoga Slim 7i 14IRL8",
              "Yoga Duet 13",
              "Yoga Book 9i 13IMH9"
            ]
          },
          "ThinkPad_P": {
            "type": "Workstation",
            "series": [
              "ThinkPad P16v Gen 1",
              "ThinkPad P1 Gen 6",
              "ThinkPad P1 Gen 5",
              "ThinkPad P14s Gen 4",
              "ThinkPad P14s Gen 3",
              "ThinkPad P16s Gen 2",
              "ThinkPad P16s Gen 1",
              "ThinkPad P16 Gen 2",
              "ThinkPad P16 Gen 1",
              "ThinkPad P15v Gen 4",
              "ThinkPad P15v Gen 3",
              "ThinkPad P17 Gen 2"
            ]
          },
          "ThinkPad_C": {
            "type": "Chromebook",
            "series": [
              "ThinkPad C13 Yoga Chromebook",
              "ThinkPad C14 Gen 1",
              "ThinkPad C13 Gen 1",
              "Chromebook Duet 5",
              "ThinkPad C13 Yoga"
            ]
          },
          "IdeaPad_C": {
            "type": "Chromebook",
            "series": [
              "IdeaPad Flex 3 Chromebook 14\"",
              "IdeaPad Flex 5 Chromebook 14\"",
              "IdeaPad 3 Chromebook 14\"",
              "IdeaPad Slim 3 Chromebook 15\"",
              "IdeaPad Flex 5i Chromebook"
            ]
          }
        }
      },
      "ASUS": {
        "types": [
          "Gaming",
          "Business",
          "Ultrabook",
          "Workstation",
          "2-in-1 Convertible",
          "Budget/Student",
          "Chromebook"
        ],
        "models": {
          "ROG": {
            "type": "Gaming",
            "series": [
              "ROG Strix G18 G814JV",
              "ROG Strix G16 G614JV",
              "ROG Strix G15 G513",
              "ROG Strix SCAR 18 G834JY",
              "ROG Strix SCAR 16 G634JY",
              "ROG Strix SCAR 15 G533",
              "ROG Strix SCAR 17 G733",
              "ROG Zephyrus G16 GU605MY",
              "ROG Zephyrus G14 GA403UV",
              "ROG Zephyrus G14 GA402XV",
              "ROG Zephyrus M16 GU604VY",
              "ROG Zephyrus M16 GU603ZW",
              "ROG Flow X16 GV601VY",
              "ROG Flow X13 GV302XV",
              "ROG Flow Z13 GZ301VU",
              "ROG Strix G17 G713PI",
              "ROG Strix G18 G814JI"
            ]
          },
          "TUF": {
            "type": "Gaming",
            "series": [
              "TUF Gaming A16 FA607PV",
              "TUF Gaming A15 FA507NV",
              "TUF Gaming A15 FA507NU",
              "TUF Gaming F15 FX507VV",
              "TUF Gaming F15 FX507ZU",
              "TUF Gaming A17 FA707NU",
              "TUF Gaming F17 FX707VV",
              "TUF Gaming A14 FA401XU",
              "TUF Gaming F14 FX407VU"
            ]
          },
          "Zenbook": {
            "type": "Ultrabook",
            "series": [
              "Zenbook 14X OLED UX5406SA",
              "Zenbook 14X OLED UX5401EA",
              "Zenbook 14 OLED UX3405MA",
              "Zenbook 14 OLED UX3402ZA",
              "Zenbook S 13 OLED UX5304MA",
              "Zenbook Pro 14 OLED UX6404VV",
              "Zenbook Pro 15 OLED UX535LI",
              "Zenbook Duo UX8406EA",
              "Zenbook Duo 14 UX8402ZA",
              "Zenbook Flip 14 UP3404VA",
              "Zenbook Flip S UX371EA",
              "Zenbook 13 OLED UX325EA",
              "Zenbook 15 OLED UX535LI"
            ]
          },
          "VivoBook": {
            "type": "Budget/Student",
            "series": [
              "VivoBook 15X OLED K5604VA",
              "VivoBook 15X OLED M5604QA",
              "VivoBook 15 X1504VA",
              "VivoBook 15 X1502ZA",
              "VivoBook 15 X1500EA",
              "VivoBook 14 X1404VA",
              "VivoBook 14 X1402ZA",
              "VivoBook 14 X1400EA",
              "VivoBook S 15 OLED S5504VA",
              "VivoBook S 14X OLED K5402ZA",
              "VivoBook Pro 15 OLED M6500QC",
              "VivoBook Pro 14 OLED M3401QA",
              "VivoBook Flip 14 TM420IA",
              "VivoBook Flip 15 TP501ZA"
            ]
          },
          "ExpertBook": {
            "type": "Business",
            "series": [
              "ExpertBook B9 B9403CVA",
              "ExpertBook B9 B9402CBA",
              "ExpertBook B5 B5602CVA",
              "ExpertBook B5 B5402CBA",
              "ExpertBook B3 B3502CVA",
              "ExpertBook B1 B1502CBA",
              "ExpertBook B1 B1402CBA",
              "ExpertBook B3 Flip B3402FBA"
            ]
          },
          "ProArt": {
            "type": "Workstation",
            "series": [
              "ProArt Studiobook 16 OLED H7604JI",
              "ProArt Studiobook 16 OLED W7600H3A",
              "ProArt Studiobook Pro 16 OLED W7600Z3A",
              "ProArt Studiobook 14 OLED H5402ZA"
            ]
          },
          "ASUS_C": {
            "type": "Chromebook",
            "series": [
              "Chromebook Flip CX5 CX5601FM",
              "Chromebook Flip CX3 CX3400CVA",
              "Chromebook CX1 CX1500CKA",
              "Chromebook Detachable CM3 CM3401",
              "Chromebook Plus CX34 CX3402CBA"
            ]
          }
        }
      },
      "Acer": {
        "types": [
          "Gaming",
          "Budget/Student",
          "Ultrabook",
          "Workstation",
          "Chromebook",
          "2-in-1 Convertible"
        ],
        "models": {
          "Predator": {
            "type": "Gaming",
            "series": [
              "Predator Helios 18 PH18-71",
              "Predator Helios 16 PH16-71",
              "Predator Helios 300 PH315-55",
              "Predator Triton 17 X PTX17-71",
              "Predator Triton 16 Neo PT16-51",
              "Predator Triton 500 SE PT516-52",
              "Predator Helios Neo 16 PHN16-71"
            ]
          },
          "Nitro": {
            "type": "Gaming",
            "series": [
              "Nitro 17 AN17-52",
              "Nitro 17 AN17-41",
              "Nitro 5 AN515-58",
              "Nitro 5 AN515-57",
              "Nitro 5 AN515-47",
              "Nitro V 15 ANV15-51",
              "Nitro V 16 ANV16-41",
              "Nitro 16 AN16-41",
              "Nitro 16 AN16-51"
            ]
          },
          "Swift": {
            "type": "Ultrabook",
            "series": [
              "Swift Go 14 SFG14-71",
              "Swift Go 14 SFG14-72",
              "Swift 3 SF314-512",
              "Swift 3 SF314-43",
              "Swift X SFX14-71",
              "Swift X SFX16-51",
              "Swift Edge SFA16-41",
              "Swift 5 SF514-55"
            ]
          },
          "Aspire": {
            "type": "Budget/Student",
            "series": [
              "Aspire 5 A515-58M",
              "Aspire 5 A515-57",
              "Aspire 5 A515-56",
              "Aspire 3 A315-59",
              "Aspire 3 A315-58",
              "Aspire 3 A315-24P",
              "Aspire 7 A715-76",
              "Aspire 7 A715-75G",
              "Aspire Vero AV15-51"
            ]
          },
          "Spin": {
            "type": "2-in-1 Convertible",
            "series": [
              "Spin 5 SP513-55N",
              "Spin 5 SP514-54N",
              "Spin 3 SP313-51N",
              "Spin 3 SP314-54N",
              "Spin 7 SP714-51"
            ]
          },
          "Chromebook_A": {
            "type": "Chromebook",
            "series": [
              "Chromebook Plus 514 CP514-2H",
              "Chromebook Plus 515 CP515-2H",
              "Chromebook Spin 514 CP514-3W",
              "Chromebook Spin 511 R753TN",
              "Chromebook 315 CB315-4HT"
            ]
          }
        }
      },
      "MSI": {
        "types": [
          "Gaming",
          "Workstation",
          "Business",
          "Ultrabook"
        ],
        "models": {
          "Raider": {
            "type": "Gaming",
            "series": [
              "Raider GE78 HX",
              "Raider GE68 HX",
              "Raider GE77 HX",
              "Raider GE76 HX",
              "Raider GE66 HX"
            ]
          },
          "Titan": {
            "type": "Gaming",
            "series": [
              "Titan GT77 HX",
              "Titan 18 HX",
              "Titan GT77 12U"
            ]
          },
          "Stealth": {
            "type": "Gaming",
            "series": [
              "Stealth 18 AI A1VHG",
              "Stealth 16 AI Studio A1VHG",
              "Stealth 17 Studio A13V",
              "Stealth 15 A13VE",
              "Stealth 16 Studio A13V"
            ]
          },
          "Vector": {
            "type": "Gaming",
            "series": [
              "Vector GP68 HX",
              "Vector GP78 HX",
              "Vector GP66",
              "Vector GP67 HX"
            ]
          },
          "Pulse": {
            "type": "Gaming",
            "series": [
              "Pulse 17 B13VGK",
              "Pulse 15 B13VGK",
              "Pulse 17 C12V",
              "Pulse 15 B13VE"
            ]
          },
          "Katana": {
            "type": "Gaming",
            "series": [
              "Katana 17 B13VGK",
              "Katana 15 B13VGK",
              "Katana 15 B13VE",
              "Katana 17 B12UC",
              "Katana 15 B12UC"
            ]
          },
          "Cyborg": {
            "type": "Gaming",
            "series": [
              "Cyborg 15 A13VF",
              "Cyborg 15 A12VE",
              "Cyborg 14 A13VF"
            ]
          },
          "Crosshair": {
            "type": "Gaming",
            "series": [
              "Crosshair 16 HX B14VFK",
              "Crosshair 17 HX B14VHG",
              "Crosshair 15 B12UC"
            ]
          },
          "Creator": {
            "type": "Workstation",
            "series": [
              "Creator Z17 HX Studio A13V",
              "Creator Z16P B13V",
              "Creator Z16 B13V",
              "Creator M16 B13V"
            ]
          },
          "Prestige": {
            "type": "Business",
            "series": [
              "Prestige 16 Studio A13VE",
              "Prestige 14 Studio A13VE",
              "Prestige 15 A12UC",
              "Prestige 16 A13M"
            ]
          },
          "Summit": {
            "type": "Business",
            "series": [
              "Summit E16 Flip A13M",
              "Summit E13 Flip Evo A13M",
              "Summit E16 Evo A13M"
            ]
          }
        }
      },
      "Microsoft": {
        "types": [
          "Ultrabook",
          "2-in-1 Convertible"
        ],
        "models": {
          "Surface_Laptop": {
            "type": "Ultrabook",
            "series": [
              "Surface Laptop 6 13.8\"",
              "Surface Laptop 6 15\"",
              "Surface Laptop 5 13.5\"",
              "Surface Laptop 5 15\"",
              "Surface Laptop 4 13.5\"",
              "Surface Laptop 4 15\"",
              "Surface Laptop Go 3",
              "Surface Laptop Go 2",
              "Surface Laptop Go"
            ]
          },
          "Surface_Pro": {
            "type": "2-in-1 Convertible",
            "series": [
              "Surface Pro 11",
              "Surface Pro 10",
              "Surface Pro 9",
              "Surface Pro 8",
              "Surface Pro X",
              "Surface Pro 7+",
              "Surface Pro 7",
              "Surface Pro 6",
              "Surface Pro 11th Gen"
            ]
          }
        }
      },
      "Razer": {
        "types": [
          "Gaming"
        ],
        "models": {
          "Blade": {
            "type": "Gaming",
            "series": [
              "Blade 18 (2024)",
              "Blade 18 (2023)",
              "Blade 16 (2024)",
              "Blade 16 (2023)",
              "Blade 14 (2024)",
              "Blade 14 (2023)",
              "Blade 14 (2022)",
              "Blade 15 (2022)",
              "Blade 15 Advanced (2021)"
            ]
          }
        }
      },
      "Huawei": {
        "types": [
          "Ultrabook",
          "2-in-1 Convertible",
          "Budget/Student"
        ],
        "models": {
          "MateBook_X": {
            "type": "Ultrabook",
            "series": [
              "MateBook X Pro 2024",
              "MateBook X Pro 2023",
              "MateBook X 2020"
            ]
          },
          "MateBook": {
            "type": "Ultrabook",
            "series": [
              "MateBook 14s 2023",
              "MateBook 14 2023",
              "MateBook 14 2022",
              "MateBook 16s 2023",
              "MateBook 16 2022",
              "MateBook 13s 2022",
              "MateBook 13 2021"
            ]
          },
          "MateBook_D": {
            "type": "Budget/Student",
            "series": [
              "MateBook D16 2024",
              "MateBook D15 2023",
              "MateBook D14 2023"
            ]
          }
        }
      },
      "Samsung": {
        "types": [
          "Ultrabook"
        ],
        "models": {
          "Galaxy_Book": {
            "type": "Ultrabook",
            "series": [
              "Galaxy Book4 Ultra",
              "Galaxy Book4 Pro 360",
              "Galaxy Book4 Pro",
              "Galaxy Book4 360",
              "Galaxy Book4",
              "Galaxy Book3 Ultra",
              "Galaxy Book3 Pro 360",
              "Galaxy Book3 Pro",
              "Galaxy Book3 360",
              "Galaxy Book3",
              "Galaxy Book2 Pro 360",
              "Galaxy Book2 Pro"
            ]
          }
        }
      }
    }
  },
  "monitors": {
    "name": "Monitors",
    "types": [
      "Gaming",
      "Professional/Design",
      "Business/Office",
      "Ultrawide",
      "Portable",
      "Budget/Home"
    ],
    "brands": {
      "Samsung": {
        "models": {
          "Odyssey OLED": {
            "type": "Gaming",
            "series": [
              "Odyssey OLED G9 (G95SC)",
              "Odyssey OLED G8 (G85SB)",
              "Odyssey OLED G6 (G60SD)"
            ]
          },
          "Odyssey": {
            "type": "Gaming",
            "series": [
              "Odyssey G9 (G95NC)",
              "Odyssey Neo G9 (G95NB)",
              "Odyssey G8 (G85NB)",
              "Odyssey G7 (G75NB)",
              "Odyssey G5 (G55C)"
            ]
          },
          "ViewFinity": {
            "type": "Professional/Design",
            "series": [
              "ViewFinity S9 (S90PC)",
              "ViewFinity S8 (S80PB)",
              "ViewFinity S6 (S65UC)"
            ]
          },
          "Smart Monitor": {
            "type": "Business/Office",
            "series": [
              "Smart Monitor M8 (M80C)",
              "Smart Monitor M7 (M70C)",
              "Smart Monitor M5 (M50C)"
            ]
          }
        }
      },
      "LG": {
        "models": {
          "UltraGear OLED": {
            "type": "Gaming",
            "series": [
              "UltraGear OLED 27GR95QE",
              "UltraGear OLED 45GR95QE"
            ]
          },
          "UltraGear": {
            "type": "Gaming",
            "series": [
              "UltraGear 27GR93U",
              "UltraGear 27GR83Q",
              "UltraGear 27GP850",
              "UltraGear 32GN650",
              "UltraGear 24GN600"
            ]
          },
          "UltraFine": {
            "type": "Professional/Design",
            "series": [
              "UltraFine 27UQ850",
              "UltraFine 32UN880",
              "UltraFine 27QN880",
              "UltraFine 27MD5KL"
            ]
          },
          "UltraWide": {
            "type": "Ultrawide",
            "series": [
              "UltraWide 38WN95C",
              "UltraWide 34WN80C",
              "UltraWide 29WN600"
            ]
          },
          "Ergo": {
            "type": "Professional/Design",
            "series": [
              "Ergo 27QN880",
              "Ergo 32UN880"
            ]
          }
        }
      },
      "Dell": {
        "models": {
          "Alienware": {
            "type": "Gaming",
            "series": [
              "AW3423DWF",
              "AW2724DM",
              "AW2723DF",
              "AW2523HF",
              "AW3423DW",
              "AW2721D"
            ]
          },
          "Ultrasharp": {
            "type": "Professional/Design",
            "series": [
              "U2724DE",
              "U2723QE",
              "U3223QE",
              "U2722D",
              "U2422H",
              "U4025QW"
            ]
          },
          "S_Series": {
            "type": "Business/Office",
            "series": [
              "S2722QC",
              "S2721DS",
              "S2421HS",
              "S2722QC",
              "S3222DGM"
            ]
          },
          "P_Series": {
            "type": "Business/Office",
            "series": [
              "P2723QE",
              "P2723D",
              "P2422H",
              "P3223QE"
            ]
          },
          "G_Series": {
            "type": "Gaming",
            "series": [
              "G2724D",
              "G2724Q",
              "G2722HS",
              "G3223Q"
            ]
          }
        }
      },
      "ASUS": {
        "models": {
          "ROG_Swift_OLED": {
            "type": "Gaming",
            "series": [
              "ROG Swift OLED PG27AQDM",
              "ROG Swift OLED PG32UCDM",
              "ROG Swift OLED PG34WCDM"
            ]
          },
          "ROG_Swift": {
            "type": "Gaming",
            "series": [
              "ROG Swift PG27AQN",
              "ROG Swift PG279QR",
              "ROG Swift PG259QN",
              "ROG Swift PG32UQX"
            ]
          },
          "TUF_Gaming": {
            "type": "Gaming",
            "series": [
              "TUF VG289Q1A",
              "TUF VG27AQ",
              "TUF VG27AQL1A",
              "TUF VG24VQ",
              "TUF VG27WQ"
            ]
          },
          "ProArt": {
            "type": "Professional/Design",
            "series": [
              "ProArt PA278CV",
              "ProArt PA32UCG",
              "ProArt PA248QV",
              "ProArt PA329CV"
            ]
          },
          "ZenScreen": {
            "type": "Portable",
            "series": [
              "ZenScreen MB16ACE",
              "ZenScreen MB16QHG",
              "ZenScreen MB16ACV"
            ]
          }
        }
      },
      "BenQ": {
        "models": {
          "MOBIUZ": {
            "type": "Gaming",
            "series": [
              "MOBIUZ EX2710Q",
              "MOBIUZ EX2510S",
              "MOBIUZ EX3210U",
              "MOBIUZ EX2710R"
            ]
          },
          "DesignVue": {
            "type": "Professional/Design",
            "series": [
              "DesignVue PD3220U",
              "DesignVue PD2700U",
              "DesignVue PD2705Q"
            ]
          },
          "SW_Series": {
            "type": "Professional/Design",
            "series": [
              "SW270C",
              "SW321C",
              "SW272U"
            ]
          }
        }
      },
      "AOC": {
        "models": {
          "AGON": {
            "type": "Gaming",
            "series": [
              "AGON AG274QXM",
              "AGON AG274UXP",
              "AGON AG254FZ",
              "AGON AG274QZ"
            ]
          },
          "CQ_Series": {
            "type": "Gaming",
            "series": [
              "CQ27G2",
              "CQ32G2SE",
              "CQ32G1"
            ]
          },
          "U_Series": {
            "type": "Professional/Design",
            "series": [
              "U27P2U",
              "U27U2DS",
              "U2777PQU"
            ]
          }
        }
      },
      "Acer": {
        "models": {
          "Predator": {
            "type": "Gaming",
            "series": [
              "Predator X27U",
              "Predator XB273U",
              "Predator X34 P",
              "Predator XB323U"
            ]
          },
          "Nitro": {
            "type": "Gaming",
            "series": [
              "Nitro XV272U",
              "Nitro VG271U",
              "Nitro KG241Y",
              "Nitro ED271U"
            ]
          },
          "ConceptD": {
            "type": "Professional/Design",
            "series": [
              "ConceptD CP3271K",
              "ConceptD CM7321A",
              "ConceptD CP7271K"
            ]
          }
        }
      }
    }
  },
  "tablets": {
    "name": "Tablets",
    "types": [
      "Premium",
      "Mid-range",
      "Budget",
      "E-Reader"
    ],
    "brands": {
      "Apple": {
        "models": {
          "iPad_Pro": {
            "type": "Premium",
            "series": [
              "iPad Pro 13\" M4 (2024)",
              "iPad Pro 11\" M4 (2024)",
              "iPad Pro 12.9\" M2 (2022)",
              "iPad Pro 11\" M2 (2022)"
            ]
          },
          "iPad_Air": {
            "type": "Premium",
            "series": [
              "iPad Air 13\" M2 (2024)",
              "iPad Air 11\" M2 (2024)",
              "iPad Air 10.9\" M1 (2022)",
              "iPad Air 10.9\" (2020)"
            ]
          },
          "iPad": {
            "type": "Mid-range",
            "series": [
              "iPad 10th Gen (2022)",
              "iPad 9th Gen (2021)",
              "iPad 8th Gen (2020)"
            ]
          },
          "iPad_Mini": {
            "type": "Mid-range",
            "series": [
              "iPad Mini 6th Gen (2021)",
              "iPad Mini 5th Gen (2019)"
            ]
          }
        }
      },
      "Samsung": {
        "models": {
          "Galaxy_Tab_S9": {
            "type": "Premium",
            "series": [
              "Galaxy Tab S9 Ultra",
              "Galaxy Tab S9+",
              "Galaxy Tab S9",
              "Galaxy Tab S9 FE+",
              "Galaxy Tab S9 FE"
            ]
          },
          "Galaxy_Tab_S8": {
            "type": "Premium",
            "series": [
              "Galaxy Tab S8 Ultra",
              "Galaxy Tab S8+",
              "Galaxy Tab S8"
            ]
          },
          "Galaxy_Tab_A": {
            "type": "Budget",
            "series": [
              "Galaxy Tab A9+",
              "Galaxy Tab A9",
              "Galaxy Tab A8",
              "Galaxy Tab A7 Lite"
            ]
          }
        }
      },
      "Lenovo": {
        "models": {
          "Tab_P": {
            "type": "Premium",
            "series": [
              "Tab P12 Pro",
              "Tab P11 Pro Gen 2",
              "Tab P11 Plus"
            ]
          },
          "Tab_M": {
            "type": "Mid-range",
            "series": [
              "Tab M10 Plus Gen 3",
              "Tab M10 Plus",
              "Tab M8"
            ]
          }
        }
      }
    }
  },
  "game_consoles": {
    "name": "Game Consoles",
    "types": [
      "Home Console",
      "Handheld Console",
      "VR Headset",
      "Accessories"
    ],
    "brands": {
      "Sony": {
        "models": {
          "PlayStation_5": {
            "type": "Home Console",
            "series": [
              "PS5 Slim Digital Edition",
              "PS5 Slim Disc Edition",
              "PS5 Digital Edition",
              "PS5 Disc Edition"
            ]
          },
          "PlayStation_VR": {
            "type": "VR Headset",
            "series": [
              "PS VR2",
              "PS VR2 Sense Controller",
              "PS VR (Original)"
            ]
          },
          "DualSense": {
            "type": "Accessories",
            "series": [
              "DualSense Edge",
              "DualSense White",
              "DualSense Black",
              "DualSense Cosmic Red",
              "DualSense Midnight Black"
            ]
          }
        }
      },
      "Microsoft": {
        "models": {
          "Xbox_Series": {
            "type": "Home Console",
            "series": [
              "Xbox Series X",
              "Xbox Series S",
              "Xbox Series X - Halo Edition"
            ]
          },
          "Xbox_Controller": {
            "type": "Accessories",
            "series": [
              "Xbox Wireless Controller - Carbon Black",
              "Xbox Wireless Controller - Robot White",
              "Xbox Elite Series 2",
              "Xbox Adaptive Controller"
            ]
          }
        }
      },
      "Nintendo": {
        "models": {
          "Switch": {
            "type": "Handheld Console",
            "series": [
              "Nintendo Switch OLED",
              "Nintendo Switch V2",
              "Nintendo Switch Lite",
              "Nintendo Switch - Animal Crossing Edition"
            ]
          }
        }
      },
      "Valve": {
        "models": {
          "Steam_Deck": {
            "type": "Handheld Console",
            "series": [
              "Steam Deck OLED 512GB",
              "Steam Deck OLED 1TB",
              "Steam Deck LCD 256GB",
              "Steam Deck LCD 64GB"
            ]
          }
        }
      },
      "Meta": {
        "models": {
          "Quest": {
            "type": "VR Headset",
            "series": [
              "Meta Quest 3 512GB",
              "Meta Quest 3 128GB",
              "Meta Quest 2 256GB",
              "Meta Quest 2 128GB",
              "Meta Quest Pro"
            ]
          }
        }
      }
    }
  },
  "accessories": {
    "name": "Accessories",
    "types": [
      "Headphones/Earbuds",
      "Speakers",
      "Chargers/Cables",
      "Power Banks",
      "Phone Cases",
      "Screen Protectors",
      "Keyboard/Mouse",
      "Laptop Bags",
      "Webcams",
      "Storage"
    ],
    "brands": {
      "Apple": {
        "models": {
          "AirPods": {
            "type": "Headphones/Earbuds",
            "series": [
              "AirPods Pro 2 (USB-C)",
              "AirPods Pro 2",
              "AirPods 3rd Gen",
              "AirPods 2nd Gen",
              "AirPods Max"
            ]
          },
          "MagSafe": {
            "type": "Chargers/Cables",
            "series": [
              "MagSafe Charger",
              "MagSafe Duo Charger",
              "MagSafe Battery Pack"
            ]
          }
        }
      },
      "Samsung": {
        "models": {
          "Galaxy_Buds": {
            "type": "Headphones/Earbuds",
            "series": [
              "Galaxy Buds3 Pro",
              "Galaxy Buds2 Pro",
              "Galaxy Buds FE",
              "Galaxy Buds2",
              "Galaxy Buds Live"
            ]
          },
          "Galaxy_Watch": {
            "type": "Smartwatch",
            "series": [
              "Galaxy Watch 7 44mm",
              "Galaxy Watch 7 40mm",
              "Galaxy Watch Ultra",
              "Galaxy Watch 6 Classic",
              "Galaxy Watch 6",
              "Galaxy Watch 5 Pro"
            ]
          }
        }
      },
      "Sony": {
        "models": {
          "WH_Series": {
            "type": "Headphones/Earbuds",
            "series": [
              "WH-1000XM5",
              "WH-1000XM4",
              "WH-CH720N",
              "WH-CH520"
            ]
          },
          "WF_Series": {
            "type": "Headphones/Earbuds",
            "series": [
              "WF-1000XM5",
              "WF-1000XM4",
              "WF-C700N",
              "WF-C500",
              "LinkBuds S",
              "LinkBuds"
            ]
          }
        }
      },
      "Logitech": {
        "models": {
          "MX_Master": {
            "type": "Keyboard/Mouse",
            "series": [
              "MX Master 3S",
              "MX Master 2S",
              "MX Anywhere 3S",
              "MX Anywhere 2S"
            ]
          },
          "MX_Keys": {
            "type": "Keyboard/Mouse",
            "series": [
              "MX Keys S",
              "MX Keys Mini",
              "MX Keys",
              "K380",
              "K780"
            ]
          },
          "G_Series": {
            "type": "Keyboard/Mouse",
            "series": [
              "G Pro X Superlight 2",
              "G Pro X Superlight",
              "G502 X Plus",
              "G502 X",
              "G715",
              "G915",
              "G Pro Keyboard"
            ]
          }
        }
      },
      "Bose": {
        "models": {
          "QuietComfort": {
            "type": "Headphones/Earbuds",
            "series": [
              "QuietComfort Ultra Headphones",
              "QuietComfort 45",
              "QuietComfort 35 II",
              "QuietComfort Earbuds II",
              "QuietComfort Earbuds",
              "Sport Earbuds"
            ]
          },
          "SoundLink": {
            "type": "Speakers",
            "series": [
              "SoundLink Max",
              "SoundLink Flex",
              "SoundLink Revolve+",
              "SoundLink Color II",
              "SoundLink Mini II"
            ]
          }
        }
      },
      "Anker": {
        "models": {
          "Soundcore": {
            "type": "Headphones/Earbuds",
            "series": [
              "Soundcore Liberty 4",
              "Soundcore Liberty 3 Pro",
              "Soundcore Space A40",
              "Soundcore Life Q35",
              "Soundcore Life P3"
            ]
          },
          "PowerCore": {
            "type": "Power Banks",
            "series": [
              "PowerCore 26800",
              "PowerCore 20000",
              "PowerCore Slim 10000",
              "PowerCore III Elite 25600"
            ]
          },
          "Charger": {
            "type": "Chargers/Cables",
            "series": [
              "Nano II 65W",
              "Nano II 45W",
              "Nano II 30W",
              "PowerPort III 65W",
              "PowerLine III USB-C Cable"
            ]
          }
        }
      },
      "JBL": {
        "models": {
          "Flip": {
            "type": "Speakers",
            "series": [
              "Flip 6",
              "Flip 5",
              "Flip Essential 2"
            ]
          },
          "Charge": {
            "type": "Speakers",
            "series": [
              "Charge 5",
              "Charge 4",
              "Charge 3"
            ]
          },
          "Xtreme": {
            "type": "Speakers",
            "series": [
              "Xtreme 3",
              "Xtreme 2",
              "Xtreme 4"
            ]
          },
          "Tune": {
            "type": "Headphones/Earbuds",
            "series": [
              "Tune 770NC",
              "Tune 760NC",
              "Tune 520BT",
              "Tune 235NC TWS",
              "Tune Flex"
            ]
          }
        }
      },
      "Razer": {
        "models": {
          "BlackWidow": {
            "type": "Keyboard/Mouse",
            "series": [
              "BlackWidow V4 Pro",
              "BlackWidow V4",
              "BlackWidow V3 Pro",
              "BlackWidow V3",
              "BlackWidow V3 Mini",
              "Huntsman V3 Pro"
            ]
          },
          "DeathAdder": {
            "type": "Keyboard/Mouse",
            "series": [
              "DeathAdder V3 Pro",
              "DeathAdder V3",
              "DeathAdder Essential",
              "DeathAdder Elite"
            ]
          },
          "Viper": {
            "type": "Keyboard/Mouse",
            "series": [
              "Viper V3 Pro",
              "Viper V2 Pro",
              "Viper Ultimate",
              "Viper Mini"
            ]
          }
        }
      },
      "Corsair": {
        "models": {
          "K_Series": {
            "type": "Keyboard/Mouse",
            "series": [
              "K100 RGB",
              "K70 RGB",
              "K70 MAX",
              "K65 RGB Mini",
              "K60 RGB Pro"
            ]
          },
          "M_Series": {
            "type": "Keyboard/Mouse",
            "series": [
              "Dark Core RGB Pro SE",
              "Harpoon RGB Wireless",
              "Ironclaw RGB",
              "Scimitar RGB Elite"
            ]
          },
          "Void": {
            "type": "Headphones/Earbuds",
            "series": [
              "Void RGB Elite",
              "Void Pro",
              "HS80 RGB Wireless",
              "HS70 Pro",
              "HS55 Wireless"
            ]
          }
        }
      }
    }
  },
  "smartwatches": {
    "name": "Smartwatches",
    "types": [
      "Premium Smartwatch",
      "Fitness Tracker",
      "Kids Watch",
      "Outdoor/Adventure"
    ],
    "brands": {
      "Apple": {
        "models": {
          "Apple_Watch": {
            "type": "Premium Smartwatch",
            "series": [
              "Apple Watch Ultra 2",
              "Apple Watch Ultra",
              "Apple Watch Series 9 45mm",
              "Apple Watch Series 9 41mm",
              "Apple Watch SE (2023)"
            ]
          }
        }
      },
      "Samsung": {
        "models": {
          "Galaxy_Watch_SW": {
            "type": "Premium Smartwatch",
            "series": [
              "Galaxy Watch 7 44mm",
              "Galaxy Watch 7 40mm",
              "Galaxy Watch Ultra",
              "Galaxy Watch 6 Classic",
              "Galaxy Watch 6",
              "Galaxy Watch 5 Pro",
              "Galaxy Watch 5",
              "Galaxy Watch 4 Classic"
            ]
          }
        }
      },
      "Garmin": {
        "models": {
          "Fenix": {
            "type": "Outdoor/Adventure",
            "series": [
              "Fenix 7X Pro",
              "Fenix 7 Pro",
              "Fenix 7S Pro",
              "Fenix 7",
              "Fenix 6 Pro"
            ]
          },
          "Forerunner": {
            "type": "Fitness Tracker",
            "series": [
              "Forerunner 965",
              "Forerunner 265",
              "Forerunner 165",
              "Forerunner 55",
              "Forerunner 255"
            ]
          },
          "Venu": {
            "type": "Premium Smartwatch",
            "series": [
              "Venu 3",
              "Venu 2 Plus",
              "Venu 2",
              "Venu Sq 2"
            ]
          }
        }
      },
      "Fitbit": {
        "models": {
          "Fitbit_Fitness": {
            "type": "Fitness Tracker",
            "series": [
              "Charge 6",
              "Charge 5",
              "Charge 4",
              "Luxe",
              "Inspire 3",
              "Ace 3"
            ]
          },
          "Fitbit_Smartwatch": {
            "type": "Premium Smartwatch",
            "series": [
              "Versa 4",
              "Versa 3",
              "Sense 2",
              "Sense"
            ]
          }
        }
      },
      "Amazfit": {
        "models": {
          "Amazfit_GTR": {
            "type": "Premium Smartwatch",
            "series": [
              "GTR 4",
              "GTR 3 Pro",
              "GTR 3",
              "GTR 2",
              "GTR Mini"
            ]
          },
          "Amazfit_GTS": {
            "type": "Premium Smartwatch",
            "series": [
              "GTS 4",
              "GTS 4 Mini",
              "GTS 3",
              "GTS 2",
              "GTS 2 Mini"
            ]
          },
          "Amazfit_Band": {
            "type": "Fitness Tracker",
            "series": [
              "Band 7",
              "Band 6",
              "Band 5",
              "Bip 5",
              "Bip 3 Pro"
            ]
          }
        }
      }
    }
  }
};

function getCategories() { return Object.keys(productHierarchy).map(slug => ({ slug, name: productHierarchy[slug].name, hasTypes: !!productHierarchy[slug].types, types: productHierarchy[slug].types || [], brands: Object.keys(productHierarchy[slug].brands) })); }
function getBrands(category) { if (!productHierarchy[category]) return []; return Object.keys(productHierarchy[category].brands).map(name => ({ name, models: Object.keys(productHierarchy[category].brands[name].models), types: productHierarchy[category].brands[name].types || productHierarchy[category].types || [] })); }
function getModels(category, brand) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand]) return []; return Object.entries(productHierarchy[category].brands[brand].models).map(([modelName, data]) => ({ name: modelName, type: data.type || '', series: data.series, specs: data.specs || {} })); }
function getSeries(category, brand, model) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand] || !productHierarchy[category].brands[brand].models[model]) return []; return productHierarchy[category].brands[brand].models[model].series; }
function getTypes(category) { if (!productHierarchy[category]) return []; return productHierarchy[category].types || []; }
function getBrandsByType(category, type) { if (!productHierarchy[category] || !type) return getBrands(category); const brands = productHierarchy[category].brands; return Object.entries(brands).filter(([_, data]) => !data.types || data.types.includes(type)).map(([name, data]) => ({ name, models: Object.keys(data.models).filter(m => !data.models[m].type || data.models[m].type === type) })); }
function getModelsByType(category, brand, type) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand]) return []; const models = productHierarchy[category].brands[brand].models; return Object.entries(models).filter(([_, data]) => !data.type || data.type === type).map(([modelName, data]) => ({ name: modelName, type: data.type || '', series: data.series })); }
function getDefaultSpecs(category, brand, model) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand] || !productHierarchy[category].brands[brand].models[model]) return {}; return productHierarchy[category].brands[brand].models[model].specs || {}; }

module.exports = { productHierarchy, getCategories, getBrands, getModels, getSeries, getTypes, getBrandsByType, getModelsByType, getDefaultSpecs };
