var search = document.getElementById('searchInput');
var places = document.getElementById('places');
var queryplace ="paris"
var querylocationId=187147
search.addEventListener('input',async(e)=>{
    var val = e.target.value
    const url = 'https://travel-advisor.p.rapidapi.com/locations/search?query='+val+'&limit=30&offset=0&units=1km&location_id=1&currency=USD&sort=relevance&lang=en_US';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9860256bacmsh7a3ed15752987a1p15030cjsnf8a6d8aadc48',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    fetch(url,options).then((data)=>{
        return data.json();
    }).then((completedata)=>{
        places.innerHTML=""
        for(let i=0; i<completedata['data'].length; i++){
            const lisuggestion = document.createElement('li');
            lisuggestion.className="list-group-item"
            lisuggestion.textContent = `${completedata.data[i].result_object.name}`
            places.appendChild(lisuggestion);
        }

    }).catch ((error)=> {
        console.error(error);
    })
    
})

//user location code
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    alert("Latitude: " + latitude + ", Longitude: " + longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


//api calls for data
const fetchdata = ()=>{

    const url = 'https://travel-advisor.p.rapidapi.com/locations/search?query='+queryplace+'&limit=30&offset=0&units=1km&location_id=1&currency=USD&sort=relevance&lang=en_US';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9860256bacmsh7a3ed15752987a1p15030cjsnf8a6d8aadc48',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    fetch(url,options).then((data)=>{
        return data.json();
    }).then((completedata)=>{
        let data1=""
        console.log(completedata);

        latitudes.splice(0, latitudes.length);
        longitudes.splice(0, longitudes.length);

        console.log("latitudes",latitudes,"longitudes",longitudes);

        for(let i=0; i<completedata['data'].length; i++){

            if(completedata.data[i].result_object.latitude)
                latitudes.push(completedata.data[i].result_object.latitude)
            if(completedata.data[i].result_object.longitude)
                longitudes.push(completedata.data[i].result_object.longitude)
            
            data1 += `<div class="card border-0">

            <div class="pictures">
                          <div id="carouselExampleControlsNoTouching" class="carousel slide h-100" data-bs-touch="false" data-bs-interval="false border-0">
                            <div class="carousel-inner h-100">
                              <div class="carousel-item active slider-images h-100 img">
                                <img class="rounded-5 " src="${completedata.data[i].result_object.photo.images.large.url}" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="${completedata.data[i].result_object.photo.images.small.url}" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="${completedata.data[i].result_object.photo.images.large.url}" class="d-block w-100" alt="...">
                              </div>
                            </div>
                            <button class="carousel-control-prev " type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
                              <span class="carousel-control-prev-icon bg-dark rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden ">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
                              <span class="carousel-control-next-icon bg-black rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                            </button>
                          </div>
                        </div>

            <div class="details">
                <h3>${i+1}. ${completedata.data[i].result_object.name}</h3>
                <div class="d-flex">
                ${completedata.data[i].result_object.rating ? `<div>${completedata.data[i].result_object.rating} stars - </div>` : "no rating - "}
                    <div class="totalreview">   
                    ${completedata.data[i].result_object.num_reviews} reviews
                    </div>
                </div>
                <p>${completedata.data[i].result_object.category.name}</p>
                <p>${completedata.data[i].result_object.location_string}</p>
            </div>
        </div>`
        }
        fetchmaplocations();
        document.getElementById('list-wrapper').innerHTML = data1;

    }).catch ((error)=> {
        console.error(error);
    })
}
//on submit in search
document.getElementById("query-submit").addEventListener("click",fetchdata)

//suggestions div visible invisible
const searchInputField=document.getElementById('searchInput')
    searchInputField.addEventListener('click',()=>{
        placesSuggestions.style.display='flex'
    })

// get value in input field on click suggestions
const placesSuggestions = document.getElementById('places-suggestions')
    $(document).ready(function(){
        $("ul #places").on('click','li',function(){
        //   alert($(this).text());
          queryplace = $(this).text();
          console.log(queryplace);
          fetchdata();
            placesSuggestions.style.display='none'
            searchInputField.value=queryplace
        })
      })




//handle click on filters
let restaurant=""
let hotels = ""
let flights = ""
let attractions =""

function handleClick(event) {
    const clickedLi = event.target;
    var Livalue = clickedLi.textContent
    if (Livalue == "Restaurants")
        fetchRestaurants();
    if (Livalue == "Flights")
        fetchFlights();
    if (Livalue == "Hotels")
        fetchHotels();
    if (Livalue == "Attractions")
        fetchAttractions();

    console.log(Livalue)
  }
    const menu = document.querySelectorAll("#dropdown-menu li");
    menu.forEach(li => {
    li.addEventListener("click", handleClick);
    });


//fetch restaurants in selected place

const fetchRestaurants = async() =>{
    const url = 'https://travel-advisor.p.rapidapi.com/restaurants/list?location_id='+querylocationId+'&restaurant_tagcategory=10591&restaurant_tagcategory_standalone=10591&currency=USD&lunit=km&limit=30&open_now=false&lang=en_US';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9860256bacmsh7a3ed15752987a1p15030cjsnf8a6d8aadc48',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    fetch(url,options).then((data)=>{
        return data.json();
    }).then((completedata)=>{
        let data1=""
        console.log(completedata);
        for(let i=0; i<completedata['data'].length; i++){
            if((Object.keys(completedata.data[i]).length)<40){
                continue
            }
            
            console.log(i+","+Object.keys(completedata.data[i]).length)
            data1 += `<div class="card border-0">

            <div class="pictures">
                          <div id="carouselExampleControlsNoTouching" class="carousel slide h-100" data-bs-touch="false" data-bs-interval="false border-0">
                            <div class="carousel-inner h-100">
                              <div class="carousel-item active slider-images h-100 img">
                                <img class="rounded-5 " src="${completedata.data[i].photo.images.large.url}" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="${completedata.data[i].photo.images.small.url}" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="${completedata.data[i].photo.images.large.url}" class="d-block w-100" alt="...">
                              </div>
                            </div>
                            <button class="carousel-control-prev " type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
                              <span class="carousel-control-prev-icon bg-dark rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden ">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
                              <span class="carousel-control-next-icon bg-black rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                            </button>
                          </div>
                        </div>

            <div class="details">
                <h3>${i+1}. ${completedata.data[i].name}</h3>
                <div class="d-flex">
                ${completedata.data[i].rating ? `<div>${completedata.data[i].rating} stars - </div>` : "no rating - "}
                    <div class="totalreview">   
                    ${completedata.data[i].num_reviews} reviews
                    </div>
                </div>
                <p>${completedata.data[i].category.name}</p>
                <p>${completedata.data[i].location_string}</p>
            </div>
        </div>`
        }

        document.getElementById('list-wrapper').innerHTML = data1;

    }).catch ((error)=> {
        console.error(error);
    })
}


//fetch attractions in selected place

const fetchFlights = async()=>{

    const url = 'https://travel-advisor.p.rapidapi.com/airports/search?query=new%20york&locale=en_US';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9860256bacmsh7a3ed15752987a1p15030cjsnf8a6d8aadc48',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };
    flightimages=["images/flight.jpg","images/f1.jpg","images/f2.jpg","images/fl3.jpg","images/fl4.jpg","images/fl4.jpg","images/fl5.jpg","images/fl6.jpg","images/fl7.jpg","images/fl3.jpg"]
    fetch(url,options).then((data)=>{
        return data.json();
    }).then((completedata)=>{
        let data1=""
        console.log(completedata);
        for(let i=0; i<completedata.length; i++){
            
            console.log(i+","+completedata[i].city_name)
            data1 += `<div class="card border-0">

            <div class="pictures">
                          <div id="carouselExampleControlsNoTouching" class="carousel slide h-100" data-bs-touch="false" data-bs-interval="false border-0">
                            <div class="carousel-inner h-100">
                              <div class="carousel-item active slider-images h-100 img">
                                <img class="rounded-5 " src="${flightimages[i]}" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="images/flight.jpg" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="images/flight.jpg" class="d-block w-100" alt="...">
                              </div>
                            </div>
                            <button class="carousel-control-prev " type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
                              <span class="carousel-control-prev-icon bg-dark rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden ">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
                              <span class="carousel-control-next-icon bg-black rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                            </button>
                          </div>
                        </div>

            <div class="details py-2">
                <h3>${i+1}. ${completedata[i].name}</h3>
                <div class="d-flex">
                ${completedata[i].rating ? `<div>${completedata[i].rating} stars - </div>` : "no rating - "}
                    <div class="totalreview">   
                    no review
                    </div>
                </div>
                <p>${completedata[i].name}</p>

            </div>
        </div>`
        }

        document.getElementById('list-wrapper').innerHTML = data1;

    }).catch ((error)=> {
        console.error(error);
    })
}

const fetchHotels = async()=>{

    const url = 'https://travel-advisor.p.rapidapi.com/hotels/list?location_id=293919&adults=1&rooms=1&nights=2&offset=0&currency=USD&order=asc&limit=30&sort=recommended&lang=en_US';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9860256bacmsh7a3ed15752987a1p15030cjsnf8a6d8aadc48',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        result.map((data)=>{
            console.log(data)
        })
    } catch (error) {
        console.log(error);
}
}


//fetch attractions

const fetchAttractions = async()=>{
    const url = 'https://travel-advisor.p.rapidapi.com/attractions/list?location_id='+querylocationId+'&currency=USD&lang=en_US&lunit=km&sort=recommended';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9860256bacmsh7a3ed15752987a1p15030cjsnf8a6d8aadc48',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    fetch(url,options).then((data)=>{
        return data.json();
    }).then((completedata)=>{
        let data1=""
        console.log(completedata);
        for(let i=0; i<completedata['data'].length; i++){
            if((Object.keys(completedata.data[i]).length)<40){
                continue
            }

            data1 += `<div class="card border-0">

            <div class="pictures">
                          <div id="carouselExampleControlsNoTouching" class="carousel slide h-100" data-bs-touch="false" data-bs-interval="false border-0">
                            <div class="carousel-inner h-100">
                              <div class="carousel-item active slider-images h-100 img">
                                <img class="rounded-5 " src="${completedata.data[i].photo.images.large.url}" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="${completedata.data[i].photo.images.small.url}" class="d-block w-100" alt="...">
                              </div>
                              <div class="carousel-item slider-images img">
                                <img class="rounded-5" src="${completedata.data[i].photo.images.large.url}" class="d-block w-100" alt="...">
                              </div>
                            </div>
                            <button class="carousel-control-prev " type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
                              <span class="carousel-control-prev-icon bg-dark rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden ">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
                              <span class="carousel-control-next-icon bg-black rounded-5" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                            </button>
                          </div>
                        </div>

            <div class="details">
                <h3>${i+1}. ${completedata.data[i].name}</h3>
                <div class="d-flex">
                ${completedata.data[i].rating ? `<div>${completedata.data[i].rating} stars - </div>` : "no rating - "}
                    <div class="totalreview">   
                    ${completedata.data[i].num_reviews}
                    </div>
                </div>
                <p>${completedata.data[i].category.name}</p>
                <p>${completedata.data[i].location_string}</p>
            </div>
        </div>`
        }

        document.getElementById('list-wrapper').innerHTML = data1;

    }).catch ((error)=> {
        console.error(error);
    })
}



// maps api
var latitudes=[]
var longitudes=[]

const fetchmaplocations = ()=>{

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (p) {
        var map;
        var marker;
        for (let i =0; i< latitudes.length; i++){
        var LatLng = new google.maps.LatLng(latitudes[i],longitudes[i]);
        var mapOptions = {
            center: LatLng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
        marker = new google.maps.Marker({
            position: LatLng,
            map: map,
            title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + latitudes[i] + "<br />Longitude: " + longitudes[i]
        });
        google.maps.event.addListener(marker, "click", function (e) {
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(marker.title);
            infoWindow.open(map, marker);
        });
    }
    });
} else {
    alert('Geo Location feature is not supported in this browser.');
}
}