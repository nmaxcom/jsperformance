window.onload = function() {
///////////////////////////////////////////
//////////  DEFINE FUNCTIONS //////////////
///////////////////////////////////////////
    function FUNCTION1() {
        var arr    = [0, 9, 0, 9, 0, 0, 1, 2, 1, 0, 1, 3, 1, 9];
        var newarr = [], zeroes = [];
        arr.forEach(function(elem, i) {
            if(elem === 0) zeroes.push(0);
            else newarr.push(elem);
        });
        newarr = newarr.concat(zeroes);
    }

//////////////////////////////////////////////
    function FUNCTION2() {
        var arr        = [0, 9, 0, 9, 0, 0, 1, 2, 1, 0, 1, 3, 1, 9];
        var filtedList = arr.filter(function(num) {
            return num !== 0;
        });
        var zeroList   = arr.filter(function(num) {
            return num === 0;
        });
        filtedList.concat(zeroList);
    }

//////////////////
// FUNCTIONS OVER
//////////////////

    var cycleResults = document.getElementById('cycleResults');
    var result       = document.getElementById('result');
    var btn          = document.getElementById('btn');

// BENCHMARK ====================
    btn.onclick = function runTests() {

        btn.setAttribute('disable', true);
        cycleResults.innerHTML = '';
        result.textContent     = 'Tests running...';

        var suite = new Benchmark.Suite;

        // add tests
        suite
            .add('Function 1... ', FUNCTION1)
            .add('Function 2... ', FUNCTION2)
            // add listeners
            .on('cycle', function(event) {
                var result         = document.createElement('li');
                result.textContent = String(event.target);

                document.getElementById('cycleResults')
                    .appendChild(result);
            })
            .on('complete', function() {
                result.textContent = 'Fastest is ' + this.filter('fastest').map('name');
                btn.setAttribute('disable', false);
            })
            // run async
            .run({
                'async': true
            });
    };

};
