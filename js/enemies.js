/* enemies.js — RPG enemy roster for Iron Quest */
const ENEMIES = [
  { avatar: '🎯', name: 'Training Dummy' },       // 1
  { avatar: '🌾', name: 'Straw Golem' },          // 2
  { avatar: '💧', name: 'Mud Sprite' },           // 3
  { avatar: '🐀', name: 'Giant Rat' },            // 4
  { avatar: '🦇', name: 'Cave Bat' },             // 5
  { avatar: '🟢', name: 'Slime Blob' },           // 6
  { avatar: '🐸', name: 'Swamp Frog' },           // 7
  { avatar: '🌿', name: 'Thorn Bush' },           // 8
  { avatar: '🦀', name: 'Rock Crab' },            // 9
  { avatar: '🐜', name: 'Giant Ant' },            // 10
  { avatar: '👺', name: 'Goblin Scout' },         // 11
  { avatar: '👺', name: 'Goblin Warrior' },       // 12
  { avatar: '👹', name: 'Hobgoblin' },            // 13
  { avatar: '👊', name: 'Orc Grunt' },            // 14
  { avatar: '🪓', name: 'Orc Raider' },           // 15
  { avatar: '🧝', name: 'Dark Elf Rogue' },       // 16
  { avatar: '🧟', name: 'Cursed Zombie' },        // 17
  { avatar: '💀', name: 'Rotting Ghoul' },        // 18
  { avatar: '☠️', name: 'Skeleton Knight' },      // 19
  { avatar: '🏹', name: 'Bone Archer' },          // 20
  { avatar: '🐺', name: 'Warg Rider' },           // 21
  { avatar: '🪨', name: 'Troll Brute' },          // 22
  { avatar: '🧙', name: 'Swamp Witch' },          // 23
  { avatar: '🔮', name: 'Forest Witch' },         // 24
  { avatar: '👻', name: 'Banshee' },              // 25
  { avatar: '🌑', name: 'Wraith' },               // 26
  { avatar: '👁️', name: 'Specter' },              // 27
  { avatar: '🌫️', name: 'Dark Shade' },           // 28
  { avatar: '🕷️', name: 'Shadow Stalker' },       // 29
  { avatar: '🐂', name: 'Minotaur' },             // 30
  { avatar: '👁️', name: 'Cyclops Brute' },        // 31
  { avatar: '🦅', name: 'Harpy Queen' },          // 32
  { avatar: '🐍', name: 'Medusa' },               // 33
  { avatar: '🦎', name: 'Basilisk' },             // 34
  { avatar: '🗿', name: 'Gargoyle' },             // 35
  { avatar: '⛏️', name: 'Stone Golem' },          // 36
  { avatar: '⚙️', name: 'Iron Golem' },           // 37
  { avatar: '🧊', name: 'Frost Giant' },          // 38
  { avatar: '🔥', name: 'Fire Giant' },           // 39
  { avatar: '⛈️', name: 'Storm Giant' },          // 40
  { avatar: '🏋️', name: 'Ogre Warlord' },         // 41
  { avatar: '🐺', name: 'Werewolf Alpha' },       // 42
  { avatar: '🧛', name: 'Vampire Lord' },         // 43
  { avatar: '💀', name: 'Lich King' },            // 44
  { avatar: '🔮', name: 'Necromancer' },          // 45
  { avatar: '🧙', name: 'Dark Sorcerer' },        // 46
  { avatar: '🤖', name: 'Arcane Golem' },         // 47
  { avatar: '🌀', name: 'Void Spawn' },           // 48
  { avatar: '😈', name: 'Chaos Imp' },            // 49
  { avatar: '👿', name: 'Demon Footsoldier' },    // 50
  { avatar: '😈', name: 'Demon Knight' },         // 51
  { avatar: '🐕', name: 'Hell Hound' },           // 52
  { avatar: '🐲', name: 'Inferno Drake' },        // 53
  { avatar: '🔥', name: 'Fire Drake' },           // 54
  { avatar: '🦕', name: 'Wyvern' },               // 55
  { avatar: '🐍', name: 'Sea Serpent' },          // 56
  { avatar: '🐙', name: 'Kraken' },               // 57
  { avatar: '🐋', name: 'Leviathan' },            // 58
  { avatar: '🦁', name: 'Manticore' },            // 59
  { avatar: '🐐', name: 'Chimera' },              // 60
  { avatar: '🦅', name: 'Griffin Lord' },         // 61
  { avatar: '🐉', name: 'Ancient Drake' },        // 62
  { avatar: '🐉', name: 'Elder Dragon' },         // 63
  { avatar: '🔥', name: 'Dragon of Flame' },      // 64
  { avatar: '❄️', name: 'Dragon of Ice' },        // 65
  { avatar: '⚡', name: 'Dragon of Storm' },      // 66
  { avatar: '🌑', name: 'Dragon of Shadow' },     // 67
  { avatar: '👑', name: 'Dragon Overlord' },      // 68
  { avatar: '🐉', name: 'Dragon Emperor' },       // 69
  { avatar: '🐍', name: 'World Serpent' },        // 70
  { avatar: '⚙️', name: 'Titan Golem' },          // 71
  { avatar: '🗿', name: 'Ancient Titan' },        // 72
  { avatar: '🧊', name: 'Frost Titan' },          // 73
  { avatar: '🔥', name: 'Inferno Titan' },        // 74
  { avatar: '⚡', name: 'Storm Titan' },          // 75
  { avatar: '😈', name: 'Arch Demon' },           // 76
  { avatar: '👑', name: 'Demon Prince' },         // 77
  { avatar: '😈', name: 'Arch Devil' },           // 78
  { avatar: '👼', name: 'Fallen Angel' },         // 79
  { avatar: '🌑', name: 'Corrupted God' },        // 80
  { avatar: '🌀', name: 'Chaos Lord' },           // 81
  { avatar: '🕳️', name: 'Void Emperor' },         // 82
  { avatar: '⭐', name: 'Dark Deity' },            // 83
  { avatar: '👁️', name: 'Ancient Evil' },         // 84
  { avatar: '💀', name: 'The Undying' },          // 85
  { avatar: '🌌', name: 'Cosmic Horror' },        // 86
  { avatar: '🌍', name: 'World Eater' },          // 87
  { avatar: '⭐', name: 'Star Destroyer' },       // 88
  { avatar: '🌀', name: 'Void Leviathan' },       // 89
  { avatar: '🔮', name: 'Nexus Beast' },          // 90
  { avatar: '🌑', name: 'Primordial Terror' },    // 91
  { avatar: '🕳️', name: 'Eternal Darkness' },     // 92
  { avatar: '💀', name: 'The Devourer' },         // 93
  { avatar: '🌀', name: 'Chaos Incarnate' },      // 94
  { avatar: '🌑', name: 'Oblivion Spawn' },       // 95
  { avatar: '🌌', name: 'The Void Itself' },      // 96
  { avatar: '💫', name: 'Cosmic Annihilator' },   // 97
  { avatar: '💥', name: 'Reality Shatterer' },    // 98
  { avatar: '⚔️', name: 'The Iron God' }          // 99
];
