(function () {
    var ns = 'http://www.w3.org/2000/svg', C = '#eae3cf', B = '#12305a';
    function mk(t, a) { var e = document.createElementNS(ns, t); for (var k in a) e.setAttribute(k, a[k]); return e }
    
    // Desenha o "V" estilizado e a régua nos SVGs da logo
    document.querySelectorAll('svg[data-v]').forEach(function (s) {
        var bg = s.closest('footer') ? '#0c2244' : B;
        s.appendChild(mk('polygon', { fill: C, points: '50,72 74,0 100,0 63,100 37,100' }));
        s.appendChild(mk('polygon', { fill: C, points: '0,0 26,0 50,72 37,100' }));
        for (var k = 0; k < 9; k++) {
            var y = 8 + k * 10.5, x = .37 * y, l = k % 2 ? 8 : 13;
            s.appendChild(mk('path', { d: 'M' + (x - 1) + ' ' + y + ' L' + (x + l) + ' ' + y, stroke: bg, 'stroke-width': 3.6, fill: 'none' }));
        }
    });

    var els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in') }); return }

    // Observador de rolagem contínuo (repete ao subir e descer)
    var io = new IntersectionObserver(function (es) { 
        es.forEach(function (e) { 
            if (e.isIntersecting) { 
                e.target.classList.add('in'); // Aparece com fade
            } else { 
                e.target.classList.remove('in'); // Some ao sair da tela para repetir depois
            } 
        }); 
    }, { threshold: .15 });

    els.forEach(function (e) { io.observe(e) });

   // Marcações de medida na seção hero sumindo uma a uma aleatoriamente ao rolar
    var ruler = document.querySelector('.hero .ruler');
    if (ruler) {
        ruler.innerHTML = '';
        var totalTicks = 24;
        var ticks = [];

        for (var i = 0; i < totalTicks; i++) {
            var tick = document.createElement('span');
            tick.className = 'ruler-tick';

            var leftPercent = 2 + (i / (totalTicks - 1)) * 96;
            var heightPx = (i % 5 === 0) ? 34 : (i % 2 === 0 ? 22 : 13);

            var ordemAleatoria = Math.random();
            var delayAleatorio = (Math.random() * 0.25).toFixed(2) + 's';

            tick.style.left = leftPercent + '%';
            tick.style.height = heightPx + 'px';
            tick.style.transitionDelay = delayAleatorio;
            tick.dataset.ordem = ordemAleatoria;

            ruler.appendChild(tick);
            ticks.push(tick);
        }

        function atualizarReguaNoScroll() {
            var heroEl = document.querySelector('.hero');
            if (!heroEl) return;

            var alturaHero = heroEl.offsetHeight || 600;
            var progresso = Math.min(Math.max(window.scrollY / (alturaHero * 0.65), 0), 1);

            ticks.forEach(function (tick) {
                var limiar = parseFloat(tick.dataset.ordem);
                if (progresso >= limiar && progresso > 0.02) {
                    tick.classList.add('puxada');
                } else {
                    tick.classList.remove('puxada');
                }
            });
        }

        window.addEventListener('scroll', atualizarReguaNoScroll, { passive: true });
        atualizarReguaNoScroll();
    }
})();