/*global Phaser*/
/*global background*/
/*global aps*/
/*global AptManager*/
/*global Player*/
//ap width 445;
//ap height 375;
var GameSCENE = function(game)
{
	this.color = randomColor({hue: "yellow", luminosity: "light"});
	this.background = null;
	this.pAptManager = null;
	this.key = null;
	this.test = null;
	this.rendertest = false;
	this.player = null;
	this.addButtons = [];
	this.tenantMenuOn = false;
	this.fullscreenButton = null;
	this.tenantMenuButton = null;
	this.tenantMenuBg = null;
	this.shopTypes = ['MODEL', 'SOLDIER'];
	this.coin = null;
	this.moneyText = null;
	this.music =
	{
		normal: null,
		danger: null,
	};
};

GameSCENE.prototype = {
    
    create: function()
	{

		var style = { font: "45px Arial", fill: "#ffffff", align: "center" };

    	

		var tenantMenuBg_width = this.game.cache.getImage("tenantMenu_bg").width;
  		var tenantMenuBg_height = this.game.cache.getImage("tenantMenu_bg").height;
		this.initMusic(this.game);
		this.music.normal.play();
		//this.music.menu.play(true);
		this.test = false;
		this.game.world.setBounds(0, 0, (4 * 445), (5 * 375));
		this.game.camera.setPosition(0, 5 * 375);

		this.player = new Player(this.game);
		this.player.init(this.game, 100);

		


		
	     //var teste = this.game.add.sprite(100,100, "tenantMenu_Bg");
		//background sprite
		this.background = this.game.add.tileSprite(0, 0, 1440, 900, 'city_dusk');
		this.background.animations.add('run');
	    this.background.animations.play('run', 10, true);
		this.background.fixedToCamera = true;
		
		//create apartments manager game/sizex/sizey
		this.pAptManager = new AptManager(this.game, 5, 5);
		this.pAptManager.init(this.game,this.player);
		//set initial size
        this.pAptManager.CreateApt(this.game, 2, 2);
        //add tenant to manager game/id/type/roomx/roomy
        this.pAptManager.AddTenant(this.game, this.player, 2, 'SOLDIER', 0, 0);
        this.pAptManager.AddTenant(this.game, this.player, 2, 'MODEL', 1, 1);
        
        //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	    // Keep original size
	    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
	    // Maintain aspect ratio
	    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
	     this.tenantMenuBg = this.game.add.sprite(0 - tenantMenuBg_width, this.game.world.height - tenantMenuBg_height, "tenantMenu_bg");
	    
	    // Não pode usar keyobard enquanto fullscreen, limitação de browsers
	    /*
	     this.fullscreenButton = this.game.add.button(1440 - 32 - 10, 10 + 32 + 16, "fullscreen_button", this.gofull, this);
	     this.fullscreenButton.anchor.setTo(0.5,0.5);
	     this.fullscreenButton.fixedToCamera = true;

	     //this.fullscreenButton.events.onInputOver.add(this.basicButtonOver(this.fullscreenButton),this);


		this.fullscreenButton.events.onInputOver.add(function()
		{
			this.basicButtonOver(this.fullscreenButton);

		}, this);

		this.fullscreenButton.events.onInputOut.add(function()
		{
			this.basicButtonOut(this.fullscreenButton);

		}, this);

*/
		this.createButton(this.fullscreenButton, "fullscreen_button", 1440 - 32 - 30, 10 + 32 + 16, this.gofull, 0.5, 0.5, true,true);
		//this.createButton(this.tenantMenuButton, "tenantMenu_button", 60, 60, this.toggleTenantMenu, 0.5, 0.5, false,false);
		
		this.tenantMenuButton = this.game.add.button(60, 60, "tenantMenu_button", this.toggleTenantMenu, this);
		this.tenantMenuButton.anchor.setTo(0.5, 0.5);
		this.tenantMenuButton.fixedToCamera = true;

		//this.tenantMenuButton = this.game.add.button(0 , this.game.world.height - 200, "proprietor" ,this.toggleTenantMenu ,this);

		this.coin = this.game.add.sprite(1150, 30, "coin");
		this.coin.fixedToCamera = true;
		this.coin.animations.add('idle');
		this.coin.animations.play('idle', 30, false);
		this.coin.events.onAnimationComplete.add(function()
		{
			this.game.time.events.add(Phaser.Timer.SECOND * 3, function()
			{
				this.coin.animations.play('idle', 30, false);
			}, this);
			console.log('animation complete');
		}, this);


		this.moneyText = this.game.add.text(48 + 20, 0 + 10, "", style);
		//this.moneyText.fixedToCamera = true;
		this.coin.addChild(this.moneyText);
		//this.tenantMenuBg.fixedToCamera = true;

		//this.tenantMenuBg = 
		//this.fullscreenButton.fixedToCamera = true;
		
	},
	
	update: function()
	{
	 	this.pAptManager.update(this.game);
	 	this.moneyText.setText("x " + this.player.money);
	},
	
	render: function()
	{
		if(this.rendertest === false)
		{
		this.game.debug.text("Debug " + this.tenantMenuBg.x, 30, 30);
		this.game.debug.text("Room clicked " + this.pAptManager.room_clicked_x + " " + this.pAptManager.room_clicked_y, 30, 50);
		this.game.debug.text("Check tenant room 0 0: " + this.pAptManager.apts_matrix[0], 30, 70);
		this.game.debug.text("Apt group size: " + this.pAptManager.apts.children.length, 30, 90);
		//this.game.debug.geom(this.pAptManager.tenants_matrix[0].sprite.getBounds());
		}
	},
	
	gofull: function() 
	{
		this.rendertest = true;
	    if (this.game.scale.isFullScreen)
	    {
	        this.game.scale.stopFullScreen();
	    }
	    else
	    {
	        this.game.scale.startFullScreen(false);
		}
	},

	toggleTenantMenu: function()
	{
		this.tweenTenantMenu();
			


	},

	createButton: function(button_variable, sprite_key, x,y,click_func, anchorx,anchory, setBasicOver, setBasicOut)
	{
		 button_variable = this.game.add.button(x, y, sprite_key,click_func, this);
	     button_variable.anchor.setTo(anchorx,anchory);
	     button_variable.fixedToCamera = true;

	     //this.fullscreenButton.events.onInputOver.add(this.basicButtonOver(this.fullscreenButton),this);


		if (setBasicOver === true)
		{
			button_variable.events.onInputOver.add(function()
			{
				this.basicButtonOver(button_variable);

			}, this);
		}

		if (setBasicOut === true)
		{
			button_variable.events.onInputOut.add(function()
			{
				this.basicButtonOut(button_variable);

			}, this);

		}

	},

	basicButtonOver: function(button)
	{

		var tweenA = this.game.add.tween(button.scale).to({ x: 1.5, y: 1.5 }, 250, "Circ", true, 0);
			

			
						tweenA.start();

	},

	basicButtonOut: function(button)
	{

		
			var tweenB = this.game.add.tween(button.scale).to({ x: 1, y: 1 }, 250, "Circ", true, 100);

			
						tweenB.start();

	},

	tweenTenantMenu: function()
	{
		var tweenA = this.game.add.tween(this.tenantMenuButton.scale).to({ x: 1.5, y: 1.5 }, 250, "Linear", true, 0);
			var tweenB = this.game.add.tween(this.tenantMenuButton.scale).to({ x: 1, y: 1 }, 250, "Linear", true, 100);

			tweenA.chain(tweenB);
						tweenA.start();

			if(this.tenantMenuOn === false)
			{
					this.tenantMenuOn = true;
					//tweenTint(this.tenantMenuButton, 0xFFFFFF, 0x000000, 250);
					this.tenantMenuButton.tint ='black';
					//tweenA.start();
					//this.game.add.tween(this.tenantMenuButton.scale).to({ x: 2, y: 2 }, 500, "Back.easeOut", true, 500);
					//tweenA.start();
					//this.tenantMenuButton.moveUp();
					this.game.add.tween(this.tenantMenuBg).to(
          {
            x: 0,
           // y: 0
          }, 500, "Circ", true, 100);

			


			}
			else
			{

				this.game.add.tween(this.tenantMenuBg).to(
          {
            x:  0 - this.tenantMenuBg.width,
           // y: 0
          }, 500, "Circ", true, 100);

				
				
					this.tenantMenuButton.tint = 0xffffff;
					this.tenantMenuOn = false;
			}

	},

	initMusic: function(game)
	{
		this.music.normal = game.add.audio("hanging");
		this.music.normal.loop = true;
		this.music.normal.volume = 0.65;
	}
};