// Global event tracking (Q2)
document.addEventListener('DOMContentLoaded', () => {
    // Track all click events
    document.addEventListener('click', (event) => {
        logEvent(event, 'click');
    });

    // Track page views for specific elements when they enter viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logEvent({ target: entry.target }, 'view');
            }
        });
    }, observerOptions);

    // Observe sections, images, and other important elements
    document.querySelectorAll('section, img, .gallery-item, .timeline-item, .skill-category').forEach(el => {
        observer.observe(el);
    });

    // Function to log events to console with timestamp
    function logEvent(event, eventType) {
        const timestamp = new Date().toISOString();
        let objectType = 'unknown';
        
        // Determine the type of object that triggered the event
        if (event.target.tagName) {
            if (event.target.tagName === 'IMG') {
                objectType = 'image';
            } else if (event.target.tagName === 'A') {
                objectType = 'link';
            } else if (event.target.tagName === 'BUTTON') {
                objectType = 'button';
            } else if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                objectType = 'input-field';
            } else if (event.target.classList.contains('gallery-item')) {
                objectType = 'gallery-item';
            } else if (event.target.classList.contains('timeline-item')) {
                objectType = 'timeline-item';
            } else if (event.target.classList.contains('skill-category')) {
                objectType = 'skill';
            } else {
                // Get the closest section if applicable
                const section = event.target.closest('section');
                if (section && section.id) {
                    objectType = `section-${section.id}`;
                } else {
                    objectType = event.target.tagName.toLowerCase();
                }
            }
        }
        
        console.log(`${timestamp}, ${eventType}, ${objectType}`);
    }

    // Text Analyzer functionality (Q3)
    const analyzeBtn = document.getElementById('analyze-btn');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeText);
    }

    function analyzeText() {
        const textInput = document.getElementById('text-input').value;
        const resultsContainer = document.querySelector('.results-container');
        
        if (!textInput) {
            alert('Please enter some text to analyze (minimum 10000 words recommended)');
            return;
        }
        
        // Make results visible
        resultsContainer.style.display = 'block';
        
        // 1. Calculate basic text statistics
        const stats = calculateTextStats(textInput);
        displayBasicStats(stats);
        
        // 2. Analyze pronouns
        const pronouns = analyzePronounsAndCount(textInput);
        displayPronounStats(pronouns);
        
        // 3. Analyze prepositions
        const prepositions = analyzePrepositionsAndCount(textInput);
        displayPrepositionStats(prepositions);
        
        // 4. Analyze indefinite articles
        const articles = analyzeArticlesAndCount(textInput);
        displayArticleStats(articles);
    }

    // Calculates basic text statistics
    function calculateTextStats(text) {
        return {
            letters: (text.match(/[a-zA-Z]/g) || []).length,
            words: text.trim().split(/\s+/).length,
            spaces: (text.match(/\s/g) || []).length,
            newlines: (text.match(/\n/g) || []).length,
            specialSymbols: (text.match(/[^\w\s]/g) || []).length
        };
    }
    
    // Displays basic text statistics
    function displayBasicStats(stats) {
        const basicStatsDiv = document.getElementById('basic-stats');
        basicStatsDiv.innerHTML = `
            <ul>
                <li>Letters: ${stats.letters}</li>
                <li>Words: ${stats.words}</li>
                <li>Spaces: ${stats.spaces}</li>
                <li>Newlines: ${stats.newlines}</li>
                <li>Special Symbols: ${stats.specialSymbols}</li>
            </ul>
        `;
    }
    
    // Analyzes and counts pronouns
    function analyzePronounsAndCount(text) {
        // List of common pronouns
        const pronounsList = [
            // Personal pronouns
            'i', 'me', 'my', 'mine', 'myself',
            'you', 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            
            // Demonstrative pronouns
            'this', 'that', 'these', 'those',
            
            // Interrogative pronouns
            'who', 'whom', 'whose', 'which', 'what',
            
            // Relative pronouns
            'who', 'whom', 'whose', 'which', 'that',
            
            // Indefinite pronouns
            'anybody', 'anyone', 'anything', 'each', 'either', 'everybody', 
            'everyone', 'everything', 'neither', 'nobody', 'no one', 'nothing', 
            'one', 'somebody', 'someone', 'something', 'both', 'few', 'many', 
            'several', 'all', 'any', 'most', 'none', 'some'
        ];
        
        // Create a Map to store pronoun counts
        const pronounCounts = new Map();
        
        // Tokenize the text
        const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
        
        // Count pronouns
        words.forEach(word => {
            if (pronounsList.includes(word)) {
                pronounCounts.set(word, (pronounCounts.get(word) || 0) + 1);
            }
        });
        
        // Convert Map to sorted array of objects
        return Array.from(pronounCounts.entries())
            .map(([pronoun, count]) => ({ pronoun, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    // Displays pronoun statistics
    function displayPronounStats(pronouns) {
        const pronounStatsDiv = document.getElementById('pronoun-stats');
        
        if (pronouns.length === 0) {
            pronounStatsDiv.innerHTML = '<p>No pronouns found in the text.</p>';
            return;
        }
        
        let html = '<table><tr><th>Pronoun</th><th>Count</th></tr>';
        pronouns.forEach(({ pronoun, count }) => {
            html += `<tr><td>${pronoun}</td><td>${count}</td></tr>`;
        });
        html += '</table>';
        
        pronounStatsDiv.innerHTML = html;
    }
    
    // Analyzes and counts prepositions
    function analyzePrepositionsAndCount(text) {
        // List of common prepositions
        const prepositionsList = [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
            'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
            'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 'during',
            'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of',
            'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
            'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards',
            'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];
        
        // Create a Map to store preposition counts
        const prepositionCounts = new Map();
        
        // Tokenize the text
        const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
        
        // Count prepositions
        words.forEach(word => {
            if (prepositionsList.includes(word)) {
                prepositionCounts.set(word, (prepositionCounts.get(word) || 0) + 1);
            }
        });
        
        // Convert Map to sorted array of objects
        return Array.from(prepositionCounts.entries())
            .map(([preposition, count]) => ({ preposition, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    // Displays preposition statistics
    function displayPrepositionStats(prepositions) {
        const prepositionStatsDiv = document.getElementById('preposition-stats');
        
        if (prepositions.length === 0) {
            prepositionStatsDiv.innerHTML = '<p>No prepositions found in the text.</p>';
            return;
        }
        
        let html = '<table><tr><th>Preposition</th><th>Count</th></tr>';
        prepositions.forEach(({ preposition, count }) => {
            html += `<tr><td>${preposition}</td><td>${count}</td></tr>`;
        });
        html += '</table>';
        
        prepositionStatsDiv.innerHTML = html;
    }
    
    // Analyzes and counts indefinite articles
    function analyzeArticlesAndCount(text) {
        // List of indefinite articles
        const articlesList = ['a', 'an'];
        
        // Create a Map to store article counts
        const articleCounts = new Map();
        
        // Tokenize the text
        const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
        
        // Count articles
        words.forEach(word => {
            if (articlesList.includes(word)) {
                articleCounts.set(word, (articleCounts.get(word) || 0) + 1);
            }
        });
        
        // Convert Map to sorted array of objects
        return Array.from(articleCounts.entries())
            .map(([article, count]) => ({ article, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    // Displays article statistics
    function displayArticleStats(articles) {
        const articleStatsDiv = document.getElementById('article-stats');
        
        if (articles.length === 0) {
            articleStatsDiv.innerHTML = '<p>No indefinite articles found in the text.</p>';
            return;
        }
        
        let html = '<table><tr><th>Indefinite Article</th><th>Count</th></tr>';
        articles.forEach(({ article, count }) => {
            html += `<tr><td>${article}</td><td>${count}</td></tr>`;
        });
        html += '</table>';
        
        articleStatsDiv.innerHTML = html;
    }
});
