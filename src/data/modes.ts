import { Mode, ModeId } from '@/types'

export const MODES: Mode[] = [
    {
        id: 'tree-growing',
        name: 'Tree Growing',
        description: 'Watch a seed sprout into a mighty tree',
        icon: '🌳',
        image: '/images/modes/tree-growing.png',
        difficulty: 'beginner',
        startingState: 'Bare soil with a tiny seed',
        transformation: 'Seed sprouts → sapling → full tree with leaves',
        colors: {
            primary: '#2d5016',
            secondary: '#4a7c2c',
            accent: '#87a96b',
        },
    },
    {
        id: 'egg-to-bird',
        name: 'Egg to Bird',
        description: 'Hatch an egg and watch the bird take flight',
        icon: '🥚',
        image: '/images/modes/egg-to-bird.png',
        difficulty: 'medium',
        startingState: 'Intact egg in a nest',
        transformation: 'Cracks appear → egg breaks → chick emerges → bird takes flight',
        colors: {
            primary: '#f0e5d8',
            secondary: '#b8d4e0',
            accent: '#4a90a4',
        },
    },
    {
        id: 'broken-glass',
        name: 'Broken Glass',
        description: 'Heal shattered glass to pristine clarity',
        icon: '💎',
        image: '/images/modes/broken-glass.png',
        difficulty: 'hard',
        startingState: 'Shattered glass across screen',
        transformation: 'Cracks heal from center → glass clears → transparent',
        colors: {
            primary: '#0a1128',
            secondary: '#60a5fa',
            accent: '#dbeafe',
        },
    },
    {
        id: 'night-sunrise',
        name: 'Night to Sunrise',
        description: 'Guide the sun from night to dawn',
        icon: '🌅',
        image: '/images/modes/night-sunrise.png',
        difficulty: 'beginner',
        startingState: 'Dark night sky with stars',
        transformation: 'Horizon glows → sun rises → full daylight',
        colors: {
            primary: '#0c1445',
            secondary: '#ff6b35',
            accent: '#ffd93d',
        },
    },
    {
        id: 'tv-static',
        name: 'TV Static',
        description: 'Clear the static to reveal the image',
        icon: '📺',
        image: '/images/modes/tv-static.png',
        difficulty: 'medium',
        startingState: 'Full-screen static noise',
        transformation: 'Signal stabilizes → image emerges → crystal clear',
        colors: {
            primary: '#121212',
            secondary: '#808080',
            accent: '#00ff00',
        },
    },
    {
        id: 'car-racing',
        name: 'Car Racing',
        description: 'Race to the finish line at top speed',
        icon: '🏎️',
        image: '/images/modes/car-racing.png',
        difficulty: 'hard',
        startingState: 'Car at starting line',
        transformation: 'Car accelerates → scenery blurs → finish line',
        colors: {
            primary: '#1a1a2e',
            secondary: '#e94560',
            accent: '#0f3460',
        },
    },
]

export const getModeById = (id: ModeId): Mode | undefined => {
    return MODES.find(mode => mode.id === id)
}

// Sample text passages for typing
export const TYPING_TEXTS = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and has been used for typing practice for over a century.",
    "In the midst of chaos, there is also opportunity. The journey of a thousand miles begins with a single step. Every moment is a fresh beginning.",
    "Creativity is intelligence having fun. The only way to do great work is to love what you do. Stay hungry, stay foolish, and never stop learning.",
    "The stars scattered across the midnight sky like diamonds on velvet, each one a distant sun with its own story to tell. The universe hummed with infinite possibility.",
    "Morning light filtered through the leaves, casting dancing shadows on the forest floor. Birds began their chorus as the world slowly awakened from slumber.",
]

export const getRandomText = (): string => {
    return TYPING_TEXTS[Math.floor(Math.random() * TYPING_TEXTS.length)]
}
