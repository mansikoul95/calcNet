
let objectD;

$(document).ready(function () {

    initiateDataSet();
    let mContainer = new Container();
    // mContainer.A('Z=5*X^2+7*X*Y+3*Y^2+1');
    
    var allInputs = [];
    allInputs.push('Z=5*X^2+7*Y^3+X*Y') //Z = 107, when {x = 3, y = 2} 
    allInputs.push('A=Z*2+100')         //A=314, from previous Z(107)
   
    mContainer.I(allInputs);
    // mContainer.A('Z=5*X^2+7*Y^3+X*Y+Z');
    // mContainer.A('Z=5*X^2+7*Y^3');
});



function initiateDataSet() {
    objectD = new D();
    Object.freeze(objectD);
    objectD.setVariableBox('A', 1);
    objectD.setVariableBox('B', 2);
    objectD.setVariableBox('C', 3);
    objectD.setVariableBox('D', 4);
    objectD.setVariableBox('E', 5);
    objectD.setVariableBox('F', 6);
    objectD.setVariableBox('G', 7);
    objectD.setVariableBox('H', 8);
    objectD.setVariableBox('I', 9);
    objectD.setVariableBox('J', 10);
    objectD.setVariableBox('K', 11);
    objectD.setVariableBox('L', 12);
    objectD.setVariableBox('M', 13);
    objectD.setVariableBox('N', 14);
    objectD.setVariableBox('O', 15);
    objectD.setVariableBox('P', 16);
    objectD.setVariableBox('Q', 17);
    objectD.setVariableBox('R', 18);
    objectD.setVariableBox('S', 19);
    objectD.setVariableBox('T', 20);
    objectD.setVariableBox('U', 21);
    objectD.setVariableBox('V', 22);
    objectD.setVariableBox('W', 23);
    objectD.setVariableBox('X', 3);
    objectD.setVariableBox('Y', 2);
    objectD.setVariableBox('Z', 4);
}

class Container {
    constructor() {
        this.ExprLength = 0;

        this.iQueueI = new Queue();
        this.oQueueI = new Queue();
        this.iQueueA = new Queue();
        this.oQueueA = new Queue();
        this.iQueueE = new Queue();
        this.oQueueE = new Queue();
        this.iQueueT = new Queue();
        this.oQueueT = new Queue();
        this.iQueueT2 = new Queue();
        this.oQueueT2 = new Queue();
        this.iQueueP = new Queue();
        this.oQueueP = new Queue();
        this.iQueueD = new Queue();
        this.oQueueD = new Queue();
    }

    I(expressions) {
        expressions.forEach((expression) => {
            this.iQueueI.enqueue(expression);
        })
        while (!this.iQueueI.isEmpty()) {
            var exp = this.iQueueI.dequeue();
            alert('Inside I machine sending to A: ' + exp);
            this.iQueueA.enqueue(exp);
            this.A();
            var sum = this.oQueueI.dequeue();
            alert('Inside I machine and we got back: ' + sum);
        }
    }

    A() {

        while(!this.iQueueA.isEmpty()) {
            let lhsRhs = this.iQueueA.dequeue().split('=');
            alert('Inside A machine sending to E: ' + lhsRhs[1]);
            this.iQueueE.enqueue(lhsRhs[1]);
            this.E();
            var sum = this.oQueueA.dequeue();
            this.oQueueI.enqueue(sum);
            alert('Inside A machine setting ' + lhsRhs[0] + " to " + sum);
            objectD.setVariableBox(lhsRhs[0], sum);
        }
    }

    E() {
        while (!this.iQueueE.isEmpty()) {
            console.log('E machine got the input ' + this.iQueueE.front());

            let terms = this.iQueueE.dequeue().split('+');
            this.ExprLength = terms.length;
            console.log("Expre len " + this.ExprLength);
            let counter = 1;
            terms.forEach((term) => {
                console.log("term sent is " + term)
                if (counter % 2 != 0) {
                    alert('Inside E sending to T1: ' + term);
                    this.iQueueT.enqueue(term);
                    this.T()
                } else {
                    alert('Inside E sending to T2: ' + term);
                    this.iQueueT2.enqueue(term);
                    this.T2();
                }
                counter++;
            })

        }
        // let terms = rhs.split('+');
        // let objectT = new T();
        // objectT.splitFactor(terms[0]);
        while (!this.oQueueE.isEmpty()) {
            console.log("size is " + this.oQueueE.messages())
            let sum = 0;
            if (this.oQueueE.messages() == this.ExprLength) {
                while (!this.oQueueE.isEmpty()) {
                    sum += this.oQueueE.dequeue();
                }
                console.log(sum);
            } else {
                break;
            }
            alert('Inside E machine sending back ' + sum);
            this.oQueueA.enqueue(sum);
        }
    }

    T() {
        console.log("i am in t1");
        while (!this.iQueueT.isEmpty()) {

            let term = this.iQueueT.dequeue();
            console.log("term is " + term)
            let factors = term.split('*');
            let resultMul = 1;
            for (let i = 0; i < factors.length; i++) {
                if (!isNaN(factors[i])) {
                    resultMul = resultMul * factors[i];
                } else if (factors[i].length > 1) {
                    alert('Inside T1 machine sending to P machine: ' + factors[i]);
                    this.iQueueP.enqueue(factors[i])
                    this.P(1);
                    resultMul = resultMul * this.oQueueT.dequeue();
                    console.log("result is " + resultMul);
                    // resultMul = resultMul * this.P();
                } else {
                    resultMul = resultMul * objectD.getVariableBoxVal(factors[i]);
                }
            }
            alert('Inside T1 machine sending back ' + resultMul);
            this.oQueueE.enqueue(resultMul);
            this.E()
        }
    }

    T2() {
        console.log("i am in t2");
        while (!this.iQueueT2.isEmpty()) {
            let term = this.iQueueT2.dequeue();
            console.log("term is " + term)
            let factors = term.split('*');
            let resultMul = 1;
            for (let i = 0; i < factors.length; i++) {
                if (!isNaN(factors[i])) {
                    resultMul = resultMul * factors[i];
                } else if (factors[i].length > 1) {
                    alert('Inside T2 machine sending to P machine: ' + factors[i]);
                    this.iQueueP.enqueue(factors[i])
                    this.P(2);
                    resultMul = resultMul * this.oQueueT2.dequeue();
                    console.log("result is " + resultMul);
                    // resultMul = resultMul * this.P();
                } else {
                    resultMul = resultMul * objectD.getVariableBoxVal(factors[i]);
                }
            }
            alert('Inside T2 machine sending back ' + resultMul);
            this.oQueueE.enqueue(resultMul);
            this.E()
        }
    }

    P(tMachine) {
        while (!this.iQueueP.isEmpty()) {
            console.log('factor is ' + this.iQueueP.front())
            let numPow = this.iQueueP.dequeue().split('^');
            let val = 0;
            console.log("calc power for " + numPow[0] + " ^ " + numPow[1])
            if (isNaN(numPow[0])) {
                val = Math.pow(objectD.getVariableBoxVal(numPow[0]), numPow[1]);
            } else {
                val = Math.pow(numPow[0], numPow[1]);
            }
            if(tMachine == 1) {
                this.oQueueT.enqueue(val);
            }
            else {
                this.oQueueT2.enqueue(val);
            }
            
            alert('Inside P machine sending back: ' + val);
        }

    }

}

class Queue {

    constructor() {
        this.items = [];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Machine Free"
        }
        return this.items.shift();
    }

    enqueue(element) {
        this.items.push(element);
    }

    messages() {
        return this.items.length;
    }

    front() {
        if (this.isEmpty())
            return "Machine Free";
        return this.items[0];
    }


}

class D {
    constructor() {
        this._variableBox = {};
    }

    setVariableBox(alpha, val) {
        this._variableBox[alpha] = val;
    }

    getVariableBoxVal(alpha) {
        return this._variableBox[alpha];
    }
}
