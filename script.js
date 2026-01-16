// Simple script for resume website
document.addEventListener('DOMContentLoaded', () => {
    console.log('Resume website loaded successfully');
    
    // Smooth scrolling for any internal links if needed in the future
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
