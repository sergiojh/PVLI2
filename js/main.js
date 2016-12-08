var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}
//Mete todo los personajes que le vienen por parametro

function actualizapjs() {
	var data = battle._charactersById;
    var listapj = Object.keys (data);
    var characterlist = document.querySelectorAll('.character-list');
    
    //Borra lo que contenga y lo vuelve a escribir para asi actualizar los parametros
    characterlist[0].innerHTML = "";
    characterlist[1].innerHTML = "";
     for (var i = 0; i < listapj.length; i++){
        render = '<li data-chara-id=\"'+listapj[i]+'\">'+ listapj[i]
        +'(HP: <strong>'+data[listapj[i]].hp+
        '</strong>/'+ data[listapj[i]].maxHp+
        ', MP: <strong>'+data[listapj[i]].mp+'</strong>/'+data[listapj[i]].maxMp+') </li>';
        if (data[listapj[i]].party === 'heroes')
           characterlist[0].innerHTML += render;
        
        else 
            characterlist[1].innerHTML += render;
        
    } 
}
   

//funcion que pone a un jugador activo, solo puede ( nuestro objetivo) haber 1 a la vez si es el final muestro 0
function activo(data){
    var pjactive;
    var anterior;
    //Borra el otro activo
    if(anterior != undefined)anterior.classList.remove("active");
    if(data.activeCharacterId === undefined ){
    pjactive = document.querySelector('li[data-chara-id=\"' + data + '\"]');
    pjactive.classList.add("active");
    anterior = pjactive ;
}
    
};
//pone en muerto los presonajes
function muertos(){
    var personajes = battle._charactersById;
    var seleccionado;
    for(var pj in personajes){
        if(personajes[pj].isDead()) {
          seleccionado = document.querySelector('li[data-chara-id=\"'+ pj +'\"]');
          console.log(seleccionado);
          if(seleccionado.classList != "dead")
          seleccionado.classList.add("dead");
        }
    }
};

// crea el radiobutton ese de las susodichas opciones ataque,defesa y cast
function opciones(){
var form = document.querySelectorAll('.choices');
var opciones = battle.options.current._group;
form[0].innerHTML = "";
  for(var op in opciones){
     form[0].innerHTML += '<li><label><input type="radio" name="option" value="' 
     + op + '"requiered>' + op + "</label></li>";
    }
    
};

//Crea el radiobutton de las enemigos a los que puedes atacar
function targets(){
    var form = document.querySelectorAll('.choices');
    var opciones = battle.options.current._group; // Se repite el codigo de opciones pero no se/ni he intendo para que no sea asi XD
    console.log(battle);
    //el 2 se refiere a que cuando buscas .choices hay tres elementos que tienen eso y como las de targets la tiene la 2 pues eso de
    // todos modos seguro que hay una forma de que con el querySelector o get elemment salga mejor
   var pari = battle._activeCharacter.party;
  
   console.log(opciones);
    form[2].innerHTML = "";
    for(var op in opciones){
        if(pari === battle._charactersById[opciones[op]].party){// descomentar para que solo pueda atacar a enemigos
        form[2].innerHTML += '<li><font color="#009200"><label><input type="radio" name="option" value="' 
        + op + '"requiered>' + op + "</label></font></li>";
     }
     else form[2].innerHTML += '<li><font color="#B70000"><label><input type="radio" name="option" value="' 
        + op + '"requiered>' + op + "</label></font></li>";
    }
};

// Crea el radiobutton de los hechizos
function hechizos(){
var form = document.querySelectorAll('.choices');
var opciones = battle.options.current._group;
form[1].innerHTML = "";
var vacio=true;
  for(var op in opciones){
     form[1].innerHTML += '<li><label><input type="radio" name="option" value="' 
     + op + '"requiered>' + op + "</label></li>";
     vacio=false;
    }
   if(vacio) spellForm.getElementsByTagName("button")[0].disabled=true;
   else spellForm.getElementsByTagName("button")[0].disabled=false;
   
 
};
// Funcion que recarga la pagina 
// data = string del mensaje
function reload(){
if(confirm("U want play another ?"))window.location='';
};
//Devuelve aleatorio 
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }

});


battle.on('start', function (data) {
    console.log(battle);
    console.log('characs',RPG.entities.characters);
    //
});

battle.on('turn', function (data) {
    //console.log('TURN', data);
   // console.log(data);
    actualizapjs();
    activo(data.activeCharacterId);
    muertos();
    
    // TODO: render the characters
    // TODO: highlight current character
    // TODO: show battle actions form
    opciones();
    actionForm.style = "display";
});

battle.on('info', function (data) {
    //console.log('INFO', data);
    console.log(data.action);
    //var effectsTxt = prettifyEffect(data.effect || {});
    if(data.action === "defend"){
          infoPanel.innerHTML = "<strong>" + data.activeCharacterId + "</strong> improved his defense to "+ battle._charactersById[data.activeCharacterId]._defense;
    }
    else if(data.action === "attack"){
       if(data.success){
            infoPanel.innerHTML = "<strong>" + data.activeCharacterId + "</strong> has attack " + data.targetId + " causing " + prettifyEffect(data.effect || {});
        } 
       else{
        infoPanel.innerHTML = "<strong>" + data.activeCharacterId + "</strong> has tried to attack " + data.targetId + " but failed ";
       }
    }
    else{
        if(data.success){
            infoPanel.innerHTML = "<strong>" + data.activeCharacterId + "</strong> has cast <i>"+data.scrollName +" </i>to "+ data.targetId + " causing " + prettifyEffect(data.effect || {});
        } 
       else{
        infoPanel.innerHTML = "<strong>" + data.activeCharacterId + "</strong> has cast <i>"+data.scrollName +" </i>to "+ data.targetId + " but failed ";
       }

    }
  


  //  infoPanel.innerHTML = effectsTxt;
    // TODO: display turn info in the #battle-info panel
});

battle.on('end', function (data) {
    console.log('END', data);
    actualizapjs(data);
    muertos();
    infoPanel.innerHTML ="<strong>"+data.winner+"</strong>"+  " has win";
    setTimeout(reload,1000);// para que lo muestre un segundo despues
    // if(confirm("U want play another ?"))window.location='';
   
    
    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        actionForm.style.display = 'none';

        var action = actionForm.elements['option'].value;
        battle.options.select(action);
        
        if(action === "attack"){
        console.log()
       // targetForm.style.display = 'block'; 
       targets();
       targetForm.style.display = 'block';
        //targetForm.style = "display";
        }
        else if (action === "cast"){
        console.log(battle);
        hechizos();
        spellForm.style.display = 'block';
        
        }
        else if(action != "defense"){// Para que si no pulses n
            console.log(action);
            actionForm.style = "display";
        }

        // TODO: select the action chosen by the player
        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        
        var action = targetForm.elements['option'].value;
        battle.options.select(action);
        if(action != "")targetForm.style.display = 'none';
       
        
        // TODO: select the target chosen by the player
        // TODO: hide this menu
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        console.log(battle.options);
        battle.options.cancel(); 
        targetForm.style.display = 'none';
        
        opciones();
        actionForm.style = "display";
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        var action = spellForm.elements['option'].value;
        battle.options.select(action);
        if(action != ""){
            spellForm.style.display = 'none';
            targets();
            targetForm.style.display = 'block';
        }
        // TODO: select the spell chosen by the player
        // TODO: hide this menu
        // TODO: go to select target menu
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        battle.options.cancel();
        spellForm.style.display = 'none';
        actionForm.style.display = 'block';
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    battle.start();
    
};