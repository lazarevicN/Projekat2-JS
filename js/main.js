window.onload = function(){
    $("#ubaciTaster").click(napraviRedIPrikaziArtikle)
    $("#divUkupneCene").hide()
    $("#tasterPosalji").hide()
    $("#tasterPosalji").click(posaljiServeru)
}

function posaljiServeru(){
    let validno = true;

    let izabraniArtikli = $(".listaArtikala")
    let nizArtikala = []
    for(let a of izabraniArtikli){
        if(a.value == "0"){
            validno = false
        }else{
            nizArtikala.push(a.value)
        }
    }

    let izabranaKolicina = $(".kolicinaArtikla")
    let nizKolicina = []
    for(let k of izabranaKolicina){
        if(k.value == "0"){
            validno = false
        }else{
            nizKolicina.push(k.value)
        }
    }

    let ceneArtikala = $(".cenaArtikla")
    let nizCena = []
    for(let c of ceneArtikala){
        if(c.value == "0"){
            validno = false
        }else{
            nizCena.push(c.textContent)
        }
    }

    if(validno){
        var podaciZaSlanje = []
        for(let i = 0; i < nizArtikala.length; i++){
            podaciZaSlanje.push({artikal : nizArtikala[i], kolicina: nizKolicina[i], cena: nizCena[i]})
        }
        console.log(typeof podaciZaSlanje)
        $.ajax({
            url: "obrada.php",
            method: "POST",
            data: podaciZaSlanje,
            success:function(data){
                alert("Uspesno slanje")
            },
            error:function(xhr, status, error){
                alert("Neuspesno slanje")
            }
        })
    }else{
        alert("Nije validno")
    }
}
    

function napraviRedIPrikaziArtikle(){
    
    ajaxZahtev("data/artikli.json", function(artikli){
        ispisNovogRedaTabele(artikli)
        let nizTasteraZaIzbacivanje = document.getElementsByClassName("izbaciArtikal")
        for(let i = 0; i < nizTasteraZaIzbacivanje.length; i++){
            nizTasteraZaIzbacivanje[i].addEventListener("click", izbaciIzKorpe)
        }
        $(".listaArtikala").change(dohvatiCenuIzabranogArtikla)
        $(".kolicinaArtikla").change(izracunajCenuArtikla)
    })
}

function izracunajCenuArtikla(){
    let trenutniElement = $(this)
    let kolicinaVal = $(this).val()
    let cena = $(this).parent().next().find(".cenaArtikla")
    let ukupnaCena = 0
    let idArtikla = $(this).parent().prev().find(".listaArtikala").val()
    if(kolicinaVal == 0){
        trenutniElement.parent().next().find(".cenaArtikla").html("0")
        izracunajUkupnuCenuKorpe()
    }
    if(kolicinaVal >= 1){
        ajaxZahtev("data/artikli.json", function(artikli){
            let filtriranArtikal = artikli.filter(a => a.id == idArtikla)
            for(let f of filtriranArtikal){
                ukupnaCena = kolicinaVal * f.cena1
            }
            trenutniElement.parent().next().find(".cenaArtikla").html(ukupnaCena)
            izracunajUkupnuCenuKorpe()
        })

    }
    if(kolicinaVal > 10){

        ajaxZahtev("data/artikli.json", function(artikli){
            let filtriranArtikal = artikli.filter(a => a.id == idArtikla)
            console.log(filtriranArtikal)
            for(let f of filtriranArtikal){
                ukupnaCena = kolicinaVal * f.cena2
            }
            trenutniElement.parent().next().find(".cenaArtikla").html(ukupnaCena)
            izracunajUkupnuCenuKorpe()
        })
    }

}

function dohvatiCenuIzabranogArtikla(){

    let izabranArtikalVal = $(this).val()
    let cena = $(this).parent().next().next().find(".cenaArtikla")
    let kolicina = $(this).parent().next().find(".kolicinaArtikla").val("1")

    if(izabranArtikalVal != 0){
        ajaxZahtev("data/artikli.json", function(artikli){
            let filtriranArtikal = artikli.filter(a => a.id == izabranArtikalVal)
            for(let f of filtriranArtikal){
                cena.html(f.cena1)
            }
            izracunajUkupnuCenuKorpe()
        })
        $("#divUkupneCene").fadeIn()
        $("#tasterPosalji").fadeIn()
        
    }else{
        cena.html("0")
    }
}

function izracunajUkupnuCenuKorpe(){
    let nizCena = $(".cenaArtikla")
    let cene = []
    for(let cena of nizCena){
        cene.push(parseInt(cena.textContent))
    }
    let ukupnaCena = 0
    for(let cena of cene){
        ukupnaCena += cena
    }

    document.getElementById("ukupnaCena").innerHTML = ukupnaCena
}

function izbaciIzKorpe(){
    $(this).parent().parent().remove()
    izracunajUkupnuCenuKorpe()
}

function ispisNovogRedaTabele(artikli){
    let napraviTr = document.createElement("tr")
    let prviTd = document.createElement("td")
    prviTd.setAttribute("class", "border border-dark")

    let napraviListu = document.createElement("select")
    napraviListu.setAttribute("class", "ml-2 listaArtikala")
    napraviListu.setAttribute("name", "listaArtikala")
    let napraviOption = document.createElement("option")
    napraviOption.setAttribute("value", "0")
    napraviOption.innerHTML = "Izaberite..."
    napraviListu.appendChild(napraviOption)
    artikli.forEach(a => {
        let napraviOption = document.createElement("option")
        napraviOption.setAttribute("value", a.id)
        napraviOption.innerHTML += a.naziv
        napraviListu.appendChild(napraviOption)
    })
    prviTd.appendChild(napraviListu)
    napraviTr.appendChild(prviTd)
    
    let drugiTd = document.createElement("td")
    drugiTd.setAttribute("class", "border border-dark")
    let napraviTasterKolicine =  document.createElement("input")
    napraviTasterKolicine.setAttribute("class", "kolicinaArtikla ml-2")
    napraviTasterKolicine.setAttribute("type", "number")
    napraviTasterKolicine.setAttribute("value", "1")
    drugiTd.appendChild(napraviTasterKolicine)
    napraviTr.appendChild(drugiTd)
    
    let treciTd = document.createElement("td")
    treciTd.setAttribute("class", "border border-dark")
    let napraviSpanCene = document.createElement("span")
    napraviSpanCene.setAttribute("class", "cenaArtikla ml-2")
    napraviSpanCene.innerHTML = 0
    treciTd.appendChild(napraviSpanCene)
    napraviTr.appendChild(treciTd)

    let cetvrtiTd = document.createElement("td")
    let napraviTasterIzbaci = document.createElement("input")
    napraviTasterIzbaci.setAttribute("class", "izbaciArtikal ml-2")
    napraviTasterIzbaci.setAttribute("type", "button")
    napraviTasterIzbaci.setAttribute("value", "Izbaci artikal")
    cetvrtiTd.appendChild(napraviTasterIzbaci)
    napraviTr.appendChild(cetvrtiTd)

    document.getElementById("korpaArtikala").appendChild(napraviTr)
}

function ajaxZahtev(putanja, uspeh){
    $.ajax({
        url: putanja,
        method: "GET",
        dataType: "json",
        success: uspeh,
        error: function(xhr, status, error){
            console.log("Neuspesan AJAX zahtev.")
        }
    })
}
