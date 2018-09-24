window.onload = () => {
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const canvas = document.createElement('canvas');
    const ct = canvas.getContext('2d');
    const largeurBlock = canvasWidth / blockSize;
    const hauteurBlock = canvasHeight / blockSize;
    const centreX = canvasWidth/2;
    const centreY = canvasHeight/2;
    let snakee;
    let aplee;
    let timeout;
    let delay = 100;
    let score;
    

    


    const init = () => { 
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '30px solid blue';
        canvas.style.backgroundColor = '#ddd';
        document.body.appendChild(canvas);
        launch();
    }

     
    const launch = () => {
             snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
             aplee = new apple([10, 10]);
             score = 0;
             clearTimeout(timeout);
             delay = 100;
             refreshCanvas();
        } 
        
    const refreshCanvas = () => {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } 
        else
        {
            if (snakee.isEatApple(aplee))
            {
                score++;              
                snakee.mangeApple = true;
                
                do 
                {
                    aplee.setNewPosition();
                }
                while (aplee.isOnSnake(snakee));
                    
                if (score % 5 == 0){
                    speedUp();
                    }
             }

            ct.clearRect(0, 0, canvasWidth, canvasHeight);
            afficheScore();
            snakee.draw(); 
            aplee.draw();
            timeout = setTimeout(refreshCanvas, delay);
        }

    }
        
    const speedUp = () => {
        delay /= 2;
    }
        
    const gameOver = () => {
            ct.save();
            ct.font = "bold 20px sans-serif";
            ct.textAlign = "center";
            ct.fillText('GAME OVER', centreX, 20);
            ct.fillText('Veuillez appuyer sur la barre Espace pour rejouer', centreX, 40);
            ct.restore();
        }
        
    const afficheScore = () => {
            ct.save();
            ct.font = "bold 200px sans-serif";
            ct.fillStyle = '#aaa';
            ct.textAlign = 'center';
            ct.textBaseline = 'middle';
            ct.fillText(score.toString(), centreX, centreY);
            ct.restore();
        }

    const drawBlock = (ct, position) => {
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ct.fillRect(x, y, blockSize, blockSize);
    }

    class Snake{
        
        
        constructor(body, direction) {
            this.body = body;
            this.direction = direction;
            this.mangeApple = false;
        }
        
        draw(){
            ct.save();
            ct.fillStyle = '#ff0000';
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ct, this.body[i]);
            }
            ct.restore();
        };
        advance(){
            const nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw ("Invalid Direction");

            }
            this.body.unshift(nextPosition);
            if (!this.mangeApple)
                this.body.pop();
            else
                this.mangeApple = false;
            
        };  
        setDirection (newDirection){
            let allowedDirection;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw ("Invalid Direction");
            }

            if (allowedDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        checkCollision () {
            let wallCollision = false;
            let snakeCollision = false;
            const head = this.body[0];
            const rest = this.body.slice(1);
            const snakeX = head[0];
            const snakeY = head[1];
            const minX = 0;
            const minY = 0;
            const maxX = largeurBlock - 1;
            const maxY = hauteurBlock - 1;
            const sortiHoriz = snakeX < minX || snakeX > maxX;
            const sortiVerti = snakeY < minY || snakeY > maxY;

            if (sortiHoriz || sortiVerti) {
                wallCollision = true;
            }
            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        isEatApple(appleToEat){
            const head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            } else {
                return false;
            }
        };


    }

    class apple {
        
        constructor (position) {
            this.position = position;
        }
        
        draw() {
            const radius = blockSize / 2;
            const x = this.position[0] * blockSize + radius;
            const y = this.position[1] * blockSize + radius;
            ct.save();
            ct.fillStyle = '#33cc33';
            ct.beginPath();
            ct.arc(x, y, radius, 0, Math.PI * 2, true);
            ct.fill();
            ct.restore();
        };
        
        setNewPosition() {
            const newX = Math.round(Math.random() * (largeurBlock - 1));
            const newY = Math.round(Math.random() * (hauteurBlock - 1));
            this.position = [newX, newY];
        };
        
        isOnSnake(snakeToCheck){
            let isOnSnake = false;
            for (let i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) 
                {
                    isOnSnake = true;
                } 

            }
            return isOnSnake;

        };

    }

    document.onkeydown = (e) => {
        const key = e.keyCode;
        let newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 32:
                launch();
                break;
            case 40:
                newDirection = "down";
                break;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    
    init();
}
