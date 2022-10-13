let usuario = {
    name : null,
    lastname:null
};

let correo = null;

let dataJson = null;

let dias = null;

let diaTurno = null;

let horarios = null;

let horarioTurno = null;

let medico = null;

const getData = async () => {
    const resp = await fetch('/data.json')
    const data = await resp.json()

    dataJson = data;
};

getData()

document.getElementById("datos").addEventListener("submit", function(event){
    event.preventDefault()

    usuario.name = document.getElementById('nombre').value;

    usuario.lastname = document.getElementById('apellido').value;

    correo = document.getElementById('correo').value;

    document.getElementById('bienvenida').innerHTML = `¡Hola ${usuario.name}!`

    document.getElementById('parrafo').innerHTML = "¿Con que profesional quiere agendar turno?"
    
    document.getElementById('datos').remove();

    seleccionMedico()
});

function seleccionMedico(){
    document.getElementById('parrafo').innerHTML = `¿Con que profesional quiere agendar turno?`

    let form = document.createElement("form");
    form.id = "seleccion-medico"

    let button = document.createElement("input");
    button.type = "submit"
    button.value = "Confirmar"

    for (i = 0; i < dataJson.length; i++){
        let div = document.createElement("div");
        let radio = document.createElement("input");
        let label = document.createElement("label");
        let data = dataJson;

        radio.setAttribute("type", "radio")
        radio.setAttribute("name", "medico");
        radio.id = i+1;

        label.textContent = `${data[i].medico} (${data[i].dias[0]} y ${data[i].dias[1]} de ${data[i].horarios[0]} hs a ${data[i].horarios[8]} hs.)`;
        label.htmlFor = `${i+1}`;

        div.appendChild(radio)
        div.appendChild(label)
        form.appendChild(div)
        form.appendChild(document.createElement("br"))
        form.appendChild(document.createElement("br"))
    }

    form.appendChild(button)

    document.getElementById("contenedor").appendChild(form);

    document.getElementById('seleccion-medico').addEventListener("submit", function(event){
        event.preventDefault()

        let dataMedico = document.querySelector('input[name="medico"]:checked').id;

        document.getElementById("seleccion-medico").remove();
    
        turnos(dataMedico)
    });
}

function turnos(dataMedico){
    return dataMedico == 1 ? clinico() : dataMedico == 2 ? cardiologo() : dataMedico == 3 ? traumatologo() : console.log("Error");
}

function clinico () {
    dias = dataJson[0].dias;
    horarios = dataJson[0].horarios;
    medico = dataJson[0].medico;

    seleccionDia()
}

function cardiologo () {
    dias = dataJson[1].dias;
    horarios = dataJson[1].horarios;
    medico = dataJson[1].medico;

    seleccionDia()
}

function traumatologo () {
    dias = dataJson[2].dias;
    horarios = dataJson[2].horarios;
    medico = dataJson[2].medico;

    seleccionDia()
}

function seleccionDia(){
    document.getElementById('parrafo').innerHTML = `Seleccione que día quiere tener el turno:`

    let form = document.createElement("form");
    form.id = "seleccion-dia"

    let button = document.createElement("input");
    button.type = "submit"
    button.value = "Confirmar"

    for (i = 0; i < dias.length; i++){
        let div = document.createElement("div");
        let radio = document.createElement("input");
        let label = document.createElement("label");

        radio.setAttribute("type", "radio")
        radio.setAttribute("name", "dia");
        radio.value = dias[i];
        radio.id = i+1;

        label.textContent = ` ${dias[i]} de ${horarios[0]} hs a ${horarios[8]} hs.`;
        label.htmlFor = `${i+1}`;

        div.appendChild(radio)
        div.appendChild(label)
        form.appendChild(div)
        form.appendChild(document.createElement("br"))
        form.appendChild(document.createElement("br"))
    }

    form.appendChild(button)

    document.getElementById("contenedor").appendChild(form);

    document.getElementById('seleccion-dia').addEventListener("submit", function(event){
        event.preventDefault()
    
        diaTurno = document.querySelector('input[name="dia"]:checked').value;

        document.getElementById("seleccion-dia").remove();
    
        seleccionHorario();
    });
}

function seleccionHorario(){
    document.getElementById('parrafo').innerHTML = "Seleccione el horario en el que quiera tener el turno:";

    let form = document.createElement("form");
    form.id = "seleccion-horario"

    let button = document.createElement("input");
    button.type = "submit"
    button.value = "Confirmar"

    for (i = 0; i < horarios.length-1; i++){
        let div = document.createElement("div");
        let radio = document.createElement("input");
        let label = document.createElement("label");

        radio.setAttribute("type", "radio")
        radio.setAttribute("name", "horario");
        radio.value = horarios[i]
        radio.id = i+1

        label.textContent = ` ${horarios[i]} hs`;
        label.htmlFor = `${i+1}`;

        div.appendChild(radio)
        div.appendChild(label)
        form.appendChild(div)
        form.appendChild(document.createElement("br"))
        form.appendChild(document.createElement("br"))
    }

    form.appendChild(button)

    document.getElementById("contenedor").appendChild(form);

    document.getElementById('seleccion-horario').addEventListener("submit", function(event){
        event.preventDefault()

        horarioTurno = document.querySelector('input[name="horario"]:checked').value;

        document.getElementById('seleccion-horario').remove();

        let confirmacion = document.createElement('p');
        confirmacion.id = "confirmacion";

        confirmacion.innerHTML = `¡Muy bien ${usuario.name}! <br><br>Ya queda agendado su turno con el ${medico} el ${diaTurno} a las ${horarioTurno} hs. <br><br>Le enviamos la confirmación de turno a ${correo} <br><br>Saludos.`
        
        document.getElementById("contenedor").appendChild(confirmacion);

        let btnTurnos = document.createElement("button");

        btnTurnos.setAttribute("data-bs-toggle", "modal")

        btnTurnos.setAttribute("data-bs-target", "#modal-turnos")

        btnTurnos.className = "btn-turnos"

        btnTurnos.innerHTML = "Ver turnos"

        document.getElementById("contenedor").appendChild(btnTurnos);

        Toastify({
            text: "Turno agendado",
            gravity:"bottom",
            style: {
              background: "#0D6EFD",
            }
        }).showToast();

        let users = localStorage.getItem("users") || [];
        let newUser = [];
        newUser.push(usuario);
        newUser.push(correo);
        newUser.push(medico);
        newUser.push(diaTurno);
        newUser.push(horarioTurno);

        if (localStorage.getItem("users") === null) {
            users.push(newUser);
        } else {
            users = JSON.parse(localStorage.users);
            users.push(newUser);
        }

        localStorage.setItem("users", JSON.stringify(users));
    });
}

document.querySelectorAll(".btn-turnos").forEach(function(button) {
    button.addEventListener("click", function() {
        if (localStorage.getItem("users") === null) {
            document.getElementById('aclaracion').style.display = "block";
            document.getElementById('borrar-turnos').setAttribute('disabled', '');
        } else {
            document.getElementById('aclaracion').style.display = "none";
            document.getElementById('borrar-turnos').removeAttribute('disabled');
            let array = JSON.parse(localStorage.users);
    
            for (let i = 0; i < array.length; i++) {
                let data = array[i];
                let { name, lastname } = data[0];

                let container = document.createElement("div");
                container.className = "usuario"

                let div1 = document.createElement("div")
                div1.innerHTML = `<p>Medico: ${data[2]}</p>`
                
                let div2 = document.createElement("div")
                div2.innerHTML = `<p>Paciente: ${name} ${lastname}</p>`

                let div3 = document.createElement("div")
                div3.innerHTML = `<p>Día: ${data[3]}</p>`

                let div4 = document.createElement("div")
                div4.innerHTML = `<p>Hora: ${data[4]}</p>`

                container.appendChild(div1);
                container.appendChild(div2);
                container.appendChild(div3);
                container.appendChild(div4);

                document.getElementById('turnos').appendChild(container);
            }
        }
    });
});

document.getElementById('cerrar-modal').addEventListener("click", function(){
    const elements = document.getElementsByClassName("usuario");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
});

document.getElementById('borrar-turnos').addEventListener("click", function(){
    document.getElementById('aclaracion').style.display = "block";
    document.getElementById('borrar-turnos').setAttribute('disabled', '');
    const elements = document.getElementsByClassName("usuario");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    localStorage.clear();

    Toastify({
        text: "Turnos borrados",
        gravity:"bottom",
        style: {
          background: "#dc3545",
        }
    }).showToast();
});