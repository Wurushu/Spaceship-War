class Game
{
    constructor()
    {
        this.timer_id = 0;
        this.timer_n = 0;
        this.time = 0;
        this.bg_speed = 1.3 * this.level_rate;
        this.bg_pos = 0;
        this.status = 0; //0_initial, 1_start, 2_pause, 3_end, 4_rank,

        this.bullets = [];
        this.friends = [];
        this.enemys = [];
        this.enemy_bullets = [];
        this.rocks = [];
        this.fuels = [];
        this.planets = [];
        this.obj_run = [
            this.bullets,
            this.friends,
            this.enemys,
            this.enemy_bullets,
            this.rocks,
            this.fuels,
            this.planets
        ];
        this.obj_hit = [
            this.friends,
            this.enemys,
            this.enemy_bullets,
            this.rocks,
            this.fuels
        ];
        
        this.planets_now = 0;
        this.planets_order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.planets_speed = [-2, -2, -2, -2, -2, -1.5, -1.5, -1.5, -1.5, -1, -1, -1];

        this.font = 24;
        this.score = 0;
        this.mute = false;

        this.level_rate = 1;
    }
    init()
    {
        this.firstAddPlanets();
        this.setSounds();
        $('.cover.start').fadeIn(500);
        setTimeout(()=>{
            $('.start .btn.btn-how').fadeIn(300).css({display: 'inline-block'});
            setTimeout(()=>{
                $('.start .btn.btn-start').fadeIn(300).css({display: 'inline-block'});
            },300);
        },300);
    }
    start()
    {
        if(this.status != 0){ return; }

        this.status = 1;
        $('.start').fadeOut(500);
        setTimeout(()=>{
            $('.btn.btn-start').append('<div class="ripple"></div>');
            $('.btn.btn-start>.ripple:first').remove();
            $('.pause-on').show();
            $('.pause-off').hide();
            this.sounds[0].play();
            
            this.timer_start();
            ship.start();
        },500);
    }
    end()
    {
        if(this.status != 1){ return; }
        this.status = 3;
        $('.pause-on').hide();
        $('.pause-off').show();
        this.sounds[0].pause();
        
        this.timer_stop();
        $('.end').show()
        $('.fuel').css({
            animationPlayState: 'paused',
        });  
    }
    pause()
    {
        if(this.status != 1){ return; }
        this.status = 2;
        this.sounds[0].pause();

        this.timer_stop();
        $('.pause.cover').show();
        $('.top .pause-on').hide();
        $('.top .pause-off').show();
        $('.fuel').css({
            animationPlayState: 'paused',
        });        
    }
    togglePause()
    {
        if(this.status == 1){ 
            this.pause();
        }else if(this.status == 2){
            this.continue();
        }
    }
    continue()
    {
        
        if(this.status != 2){ return; }
        this.status = 1;
        this.sounds[0].play();
        this.timer_start();
        $('.pause.cover').hide();        
        $('.top .pause-on').show();
        $('.top .pause-off').hide();
        $('.fuel').css({
            animationPlayState: 'running',
        });        
    }
    restart()
    {
        location.reload();
    }
    timer_start()
    {
        timer_run();
    }
    timer_stop()
    {
        cancelAnimationFrame(this.timer_id);
    }

    keyDown(e)
    {
        e = e || event;
        var key = e.keyCode;
        if(this.status != 1 && key != 65 && key != 80){
            return false;
        }
        
        switch(key){
            case 32:
                if(this.keyDownIng){ return false; }
                ship.shoot();
                break;
            case 65:
                game.start();
                break;
            case 80:
                game.togglePause();
                break;
            case 37:
                ship.move(-30, 0);
                break;
            case 38:
                ship.move(0, -30);
                break;
            case 39:
                ship.move(30, 0);
                break;
            case 40:
                ship.move(0, 30);
                break;
        }

        this.keyDownIng = true;
    }
    keyUp()
    {
        this.keyDownIng = false;
    }
    mouseMove(e)
    {
        if(this.status != 1){ return false; }
        e = e || event;

        this.mouse = true;
        this.mouse_x = e.offsetX - ($('.s-cover').width() / 2);
        this.mouse_y = e.offsetY - ($('.s-cover').height() / 2);
        $('.s-point').css({
            left: e.offsetX,
            top: e.offsetY,
        });
    }
    mouseLeave()
    {
        this.mouse = false;
        $('.s-point').css({
            left: '50%',
            top: '50%',
        });
    }
    mouseRun()
    {
        if(!this.mouse){ return false; }
        ship.move((this.mouse_x / 10) * this.level_rate, (this.mouse_y / 10) * this.level_rate);
    }
    inputName()
    {
        var text = $('.input[name="name"]').val();
        if(text.trim() == ''){
            $('.btn.btn-inputname').prop('disabled', true);
            return false;
        }else{
            $('.btn.btn-inputname').prop('disabled', false);
            return true;
        }
    }

    bgRun()
    {
        this.bg_pos -= this.bg_speed;
        $('#main').css({
            backgroundPosition: this.bg_pos,
        });
    }
    setSounds()
    {
        this.sounds = [
            new Audio('assets/sounds/background.mp3'),
            new Audio('assets/sounds/destroyed.mp3'),
            'assets/sounds/shoot.mp3',
        ];

        this.sounds[0].loop = true;
        this.sounds[0].volumn = 1;
        this.sounds[1].volumn = 1;
    }

    addPlanet(first = false)
    {
        this.planets_now++;
        if(this.planets_now > 11){
            this.planets_now = 0;
        }

        var n = this.planets_order[this.planets_now];
        var speed =  this.planets_speed[n];
        if(first){
            var x = Math.floor(Math.random() * 900);
            var y = Math.floor(Math.random() * 500);
        }else{
            var x = Math.floor(Math.random() * 200) + 900;
            var y = Math.floor(Math.random() * 500);
        }
        
        this.planets.push(new Planet(n, speed, x, y));        
    }
    firstAddPlanets()
    {
        this.planets_order.forEach(function(item, index){
            let n = Math.floor(Math.random() * 12);
            let a = item;
            game.planets_order[index] = game.planets_order[n];
            game.planets_order[n] = a;
        });
        
        for(let i=1; i<=6; i++){
            this.addPlanet(true);
        }
    }
    chFont(n)
    {
        this.font += n;
        if(this.font < 14 || this.font > 34){
            this.font -= n;
            return;
        }
        $('body').css({
            fontSize: this.font +'px',
        });
    }

    showTime()
    {
        var m = Math.floor(this.time / 60);
        m = m > 9 ? m : '0' + m;
        var s = this.time % 60;
        s = s > 9 ? s : '0' + s;
        
        $('.t-time>span').text(m + ':' + s);
    }
    showFuel()
    {
        $('.t-fuel>span').text(ship.fuel);
    }
    showScore()
    {
        $('.t-score>span').text(this.score);
    }
    chMute()
    {
        if(this.mute){
            this.mute = false;
            this.sounds[0].volume = 1;
            this.sounds[1].volume = 1;
            $('.t-sound>img').attr('src', 'assets/images/sound-on.png');
        }else{
            this.mute = true;
            this.sounds[0].volume = 0;
            this.sounds[1].volume = 0;
            $('.t-sound>img').attr('src', 'assets/images/sound-off.png');
        }
    }

    checkHit()
    {
        var hit = false;
        
        this.obj_hit.forEach((item, index)=>{
            item.forEach((item2)=>{
                if(this.checkHit2(ship, item2)){
                    hit = true;
                    item2.die();
                    if(index == 4){
                        ship.getFuel(15);
                    }else{
                        ship.loseFuel(15);
                    }
                } 
                this.bullets.forEach((item3)=>{
                    if(this.checkHit2(item2, item3)){
                        hit = true;
                        if(index == 0){
                            this.score -= 10;
                            item2.die();
                            item3.die();
                        }else if(index == 1){
                            this.score += 5;
                            item2.die();
                            item3.die();
                        }else if(index == 2){
                            item2.die();
                            item3.die();
                        }else if(index == 3){
                            item3.die();
                            if(item2.hurted()){
                                this.score += 10;
                            }
                        }
                        return false;
                    } 
                });
                if(hit){ return false; }
            }); 
            if(hit){ return false; }
        });
        
        if(hit){
            this.showScore();
        }
    }
    checkHit2(ob1, ob2)
    {
        var hit = false;
        if(Math.abs((ob1.x + ob1.width / 2) - (ob2.x + ob2.width / 2)) < (ob1.width / 2) + (ob2.width / 2)){
            if(Math.abs((ob1.y + ob1.height / 2) - (ob2.y + ob2.height / 2)) < (ob1.height / 2) + (ob2.height / 2)){
                hit = true;
            }
        }
        
        return hit
    }

    shake()
    {
        this.sounds[1].currentTime = 0;
        this.sounds[1].play();
        $('#main').addClass('shake');
        setTimeout(()=>$('#main').removeClass('shake'), 200);
    }
    addLevel()
    {
        this.level_rate += 0.4;
        time_set.enemy_shoot = parseInt(time_set.enemy_shoot * 0.7);
        
    }
    sendRank()
    {
        if(this.status != 3){ return false; }
        if(!this.inputName()){ return false; }
        $('.btn.btn-inputname').prop('disabled', true);
        this.status = 4;

        $.ajax({
            url: 'register.php',
            type: 'post',
            data: {
                name: $('input[name="name"]').val(),
                time: this.time,
                score: this.score,
            },
            success: this.showRank,
            error: function(){
                alert('failed');
                this.restart();
            }
        });
    }
    showRank(re)
    {
        let data = JSON.parse(re);
        let data2 = '';
        let n = 1;
        let is_me = '';

        data.sort(function(a, b){
            return b.score - a.score || b.time - a.time;
        });
    

        data.forEach((item, index)=>{
            if(index != 0){
                if(item.score != data[index - 1].score || item.time != data[index - 1].time){
                    n++;
                }
            }
            is_me = '';
            if(item.name == $('input[name="name"]').val() && item.score == game.score && item.time == game.time){
                is_me = 'rank-me';
            }

            data2 += `
                <tr class="${is_me}">
                    <td>${n}</td>
                    <td>${item.name}</td>
                    <td>${item.score}</td>
                    <td>${item.time}</td>
                </tr>
            `;
        });

        $('.end .dialog:not(.dialog-rank)').hide();
        $('.end .dialog.dialog-rank').fadeIn(100);
        $('.ranking-table tbody').html(data2);
    }
    
}
function log2(d)
{
    log('log score');
    d.forEach((item)=>console.log(item.score, item.time));
}

class Ship
{
    constructor()
    {
        this.ob = $('#ship');
        this.x = this.ob.position().left;
        this.y = this.ob.position().top;
        this.width = this.ob.width();
        this.height = this.ob.height();
        this.src_run = 'assets/images/ship.svg';
        this.src_stop = 'assets/images/ship_stop.svg';
        
        this.fuel = 15;
    }
    start()
    {
        this.ob.attr('src', this.src_run);
    }
    end()
    {
        this.ob.attr('src', this.src_stop);
        game.end();
    }

    shoot()
    {
        if(game.status != 1){ return false; }
        if(!game.mute){
            var shoot_sound = new Audio(game.sounds[2]);
            shoot_sound.play();
            setTimeout(()=>{ shoot_sound = {}; }, 1000);
        }
        
        game.bullets.push(new Bullet(this.x + this.width, this.y + this.height / 2));
    }
    
    getFuel()
    {
        this.fuel = this.fuel >= 15 ? 30 : this.fuel + 15;
        game.showFuel();
    }
    loseFuel(n)
    {
        this.fuel -= n;
        if(n == 15){
            game.shake();
        }
        if(this.fuel <= 0){
            this.fuel = 0;
            this.end();
        }
        game.showFuel();
    }
    move(x, y)
    {
        this.x += x;
        this.y += y;

        this.x = this.x < 0 ? 0 : this.x;
        this.y = this.y < 0 ? 0 : this.y;
        this.x = this.x + this.width > 960 ? 960 - this.width : this.x;
        this.y = this.y + this.height > 600 ? 600 - this.height : this.y;

        this.setPos();
    }
    setPos()
    {
        this.ob.css({
            left: this.x,
            top: this.y
        });
    }
}
class ob
{
    constructor(ob, x, y)
    {
        this.ob = ob;
        this.x = x;
        this.y = y;
    }
    draw()
    {
        $('.roles').append(this.ob);
        this.ob.css({
            left: this.x, 
            top: this.y,
        });

        this.width = this.ob.width();
        this.height = this.ob.height();
    }
    run()
    {
        this.x += this.speed_x * game.level_rate;
        this.y += this.speed_y * game.level_rate;

        this.ob.css({
            left: this.x,
            top: this.y,
        });

        this.run2();
    }
    die()
    {
        this.ob2 = $('<div class="boom" />');
        this.ob2.css({
            left: this.x, 
            top: this.y,
        });
        this.ob.replaceWith(this.ob2);

        setTimeout(()=>{
            this.ob2.remove();
        }, 200);

        this.parent.splice(this.parent.indexOf(this), 1);
    }
}

class Bullet extends ob
{
    constructor(x, y)
    {
        super($('<div class="bullet"></div>'), x, y);
        this.speed_x = 20;
        this.speed_y = 0;
        this.parent = game.bullets;
        this.draw();
    }
    die()
    {
        this.ob.remove();
        this.parent.splice(this.parent.indexOf(this), 1);
    }
    run2()
    {
        if(this.x >= 950){
            this.die();
        }
    }
}
class Friend  extends ob
{
    constructor()
    {
        super($('.temps>.friend:first').clone(), (Math.random() * 200) + 900, Math.random() * 500);
        this.speed_x = -1.2;
        this.speed_y = 0;
        this.parent = game.friends;
        this.foot_now = 1;
        this.foot_all = 4;
        this.draw();
    }
    chFoot()
    {

        this.foot_now = ++this.foot_now > this.foot_all ? 1 : this.foot_now;
        this.ob.attr('src', 'assets/images/friend_0'+ this.foot_now +'.png');
    }
    run2()
    {
        if(this.x <= -100){
            this.die();
        }
    }
}
class Enemy extends ob
{
    constructor()
    {
        super($('.temps>.enemy:first').clone(), (Math.random() * 200) + 900, Math.random() * 500);
        this.speed_x = -1.5;
        this.speed_y = 0;
        this.parent = game.enemys;
        this.foot_now = 1;
        this.foot_all = 4;
        this.draw();
    }
    chFoot()
    {
        this.foot_now = ++this.foot_now > this.foot_all ? 1 : this.foot_now;
        this.ob.attr('src', 'assets/images/enemy_0'+ this.foot_now +'.png');
    }
    shoot()
    {
        game.enemy_bullets.push(new EnemyBullet(this.x, this.y + this.height / 2));
    }
    run2()
    {
        if(this.x <= -100){
            this.die();
        }
    }
}
class EnemyBullet extends ob
{
    constructor(x, y)
    {
        super($('<div class="enemy-bullet"></div>'), x, y);
        this.speed_x = -5;
        this.speed_y = 0;
        this.parent = game.enemy_bullets;

        this.draw();
    }
    run2()
    {

    }
}
class Rock extends ob
{
    constructor()
    {
        super($('.temps>.rock:first').clone(), (Math.random() * 200) + 900, Math.random() * 500);
        this.speed_x = -2;
        this.speed_y = 0;
        this.parent = game.rocks;
        this.rotate = 0;
        this.life = 2;
        this.src_run = 'assets/images/rock.png';
        this.src_broken = 'assets/images/rock_broken.png';
        this.draw();
    }
    hurted()
    {
        this.ob.attr('src', this.src_broken);
        if(--this.life <= 0){
            this.die();
            return true;
        }
    }
    run2()
    {
        this.rotate -= this.speed_x;

        this.ob.css({
            transform: 'rotate('+ this.rotate +'deg)',
        });
        if(this.x <= -100){
            this.die();
        }
    }
}
class Fuel extends ob
{
    constructor()
    {
        super($('.temps>.fuel:first').clone(), Math.random() * 800, -100);
        this.speed_x = 0;
        this.speed_y = 3;
        this.parent = game.fuels;

        this.draw();
    }
    die()
    {
        this.ob.remove();
        this.parent.splice(this.parent.indexOf(this), 1);
    }
    run2()
    {
        if(this.y >= 650){
            this.die();
        }
    }
}
class Planet extends ob
{
    constructor(n, speed, x, y)
    {
        super($('.temps>.planet:eq('+ n +')').clone(), x, y);
        this.speed_x = speed
        this.speed_y = 0;
        this.parent = game.planets;
        this.draw();
    }
    die()
    {
        this.ob.remove();
        this.parent.splice(this.parent.indexOf(this), 1);
    }
    run2(){
        if(this.x <= -100){
            game.addPlanet();
            this.die();
        }
    }
}

function timer_run()
{
    if((game.timer_n+1) % time_set.sec == 0){
        game.time++;
        game.showTime();
        ship.loseFuel(1);
    }

    if(game.timer_n % time_set.add_enemy == 0){
        game.enemys.push(new Enemy());
    }
    if(game.timer_n % time_set.add_planet == 0){
        game.addPlanet();
    }
    if(game.timer_n % time_set.add_friend == 0){
        game.friends.push(new Friend());
    }
    if(game.timer_n % time_set.add_rock == 0){
        game.rocks.push(new Rock());
    }
    if(game.timer_n % time_set.add_fuel == 0){
        game.fuels.push(new Fuel());
    }
    if(game.timer_n % time_set.enemy_shoot == 0){
        game.enemys.forEach((item)=>{
            item.shoot();
        });
    }
    if(game.timer_n % time_set.ch_foot == 0){
        game.enemys.forEach((item)=>{
            item.chFoot();
        });
        game.friends.forEach((item)=>{
            item.chFoot();
        });
    }
    if((game.timer_n+1) % 300 == 0){
        game.addLevel();
    }

    game.obj_run.forEach(function(item){
        item.forEach(function(item2){
            item2.run();
        });
    });

    game.checkHit();
    game.mouseRun();
    game.bgRun();
    game.timer_n++;
    if(game.status == 1){
        game.timer_id = requestAnimationFrame(timer_run);
    }
}
function log(a)
{
    console.log(a);
}
$(window).on('load', function(){
    game = new Game();
    game.init();
    ship = new Ship();

    $(document).on('click', '.btn.btn-start', function(){ game.start(); });
    $(document).on('keydown', function(e){ game.keyDown(e) });
    $(document).on('keyup', function(){ game.keyUp() });
    $(document).on('mousemove', '.s-cover', function(e){ game.mouseMove(e) });
    $(document).on('mouseleave', '.s-cover', function(){ game.mouseLeave() });
    $(document).on('click', '.s-fire', function(){ ship.shoot() });
    $(document).on('click', '.font-1', function(){ game.chFont(-1) });
    $(document).on('click', '.font-2', function(){ game.chFont(1) });
    $(document).on('click', '.t-pause', function(){ game.togglePause(); });
    $(document).on('click', '.t-sound', function(){ game.chMute(); });
    $(document).on('input', '.input[name="name"]', function(){ game.inputName(); });
    $(document).on('click', '.btn.btn-inputname', function(){ game.sendRank(); });
})

let time_set = {
    sec: 60,
    add_friend: 320,
    add_enemy: 300,
    add_rock: 280,
    add_fuel: 350,
    enemy_shoot: 100,
    ch_foot: 15, // Change all the Friend and Enemy images.
};

let game;
let ship;