import { Router } from "express";
import axios from 'axios';
import { format, parse, addHours, addMinutes } from 'date-fns';

const stations = [
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "New Delhi", "station_code": "NDLS" },
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "Delhi Junction", "station_code": "DLI" },
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "Amritsar", "station_code": "ASR" },
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "Lucknow Charbagh", "station_code": "LKO" },
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "Varanasi", "station_code": "BSB" },
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "Dehradun", "station_code": "DDN" },
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "Chandigarh", "station_code": "CDG" },
    { "zone_name": "Northern Railway", "zone": "NR", "station_name": "Jammu Tawi", "station_code": "JAT" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Mumbai Central", "station_code": "BCT" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Bandra Terminus", "station_code": "BDTS" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Surat", "station_code": "ST" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Ahmedabad", "station_code": "ADI" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Vadodara", "station_code": "BRC" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Ratlam", "station_code": "RTM" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Udaipur City", "station_code": "UDZ" },
    { "zone_name": "Western Railway", "zone": "WR", "station_name": "Rajkot", "station_code": "RJT" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Chennai Central", "station_code": "MAS" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Chennai Egmore", "station_code": "MS" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Madurai", "station_code": "MDU" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Coimbatore", "station_code": "CBE" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Tiruchirappalli", "station_code": "TPJ" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Thiruvananthapuram Central", "station_code": "TVC" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Salem", "station_code": "SA" },
    { "zone_name": "Southern Railway", "zone": "SR", "station_name": "Mangalore Central", "station_code": "MAQ" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Howrah", "station_code": "HWH" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Sealdah", "station_code": "SDAH" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Asansol", "station_code": "ASN" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Dhanbad", "station_code": "DHN" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Malda Town", "station_code": "MLDT" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Bhagalpur", "station_code": "BGP" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Kolkata", "station_code": "KOAA" },
    { "zone_name": "Eastern Railway", "zone": "ER", "station_name": "Barddhaman", "station_code": "BWN" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Chhatrapati Shivaji Maharaj Terminus", "station_code": "CSMT" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Dadar", "station_code": "DR" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Pune", "station_code": "PUNE" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Nagpur", "station_code": "NGP" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Solapur", "station_code": "SUR" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Bhusaval", "station_code": "BSL" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Nashik Road", "station_code": "NK" },
    { "zone_name": "Central Railway", "zone": "CR", "station_name": "Shirdi", "station_code": "SNSI" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Secunderabad", "station_code": "SC" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Hyderabad", "station_code": "HYB" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Vijayawada", "station_code": "BZA" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Guntur", "station_code": "GNT" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Tirupati", "station_code": "TPTY" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Warangal", "station_code": "WL" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Nanded", "station_code": "NED" },
    { "zone_name": "South Central Railway", "zone": "SCR", "station_name": "Kazipet", "station_code": "KZJ" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Gorakhpur", "station_code": "GKP" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Lucknow Junction", "station_code": "LJN" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Varanasi City", "station_code": "BCY" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Chhapra", "station_code": "CPR" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Basti", "station_code": "BST" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Gonda", "station_code": "GD" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Bhatni", "station_code": "BTT" },
    { "zone_name": "North Eastern Railway", "zone": "NER", "station_name": "Ballia", "station_code": "BUI" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Bengaluru City", "station_code": "SBC" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Hubli", "station_code": "UBL" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Mysuru", "station_code": "MYS" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Belagavi", "station_code": "BGM" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Davangere", "station_code": "DVG" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Ballari", "station_code": "BAY" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Vijayapura", "station_code": "BJP" },
    { "zone_name": "South Western Railway", "zone": "SWR", "station_name": "Hosapete", "station_code": "HPT" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Allahabad", "station_code": "PRYJ" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Kanpur Central", "station_code": "CNB" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Agra Cantt", "station_code": "AGC" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Jhansi", "station_code": "JHS" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Gwalior", "station_code": "GWL" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Tundla", "station_code": "TDL" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Aligarh", "station_code": "ALJN" },
    { "zone_name": "North Central Railway", "zone": "NCR", "station_name": "Etawah", "station_code": "ETW" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Jaipur", "station_code": "JP" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Jodhpur", "station_code": "JU" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Bikaner", "station_code": "BKN" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Ajmer", "station_code": "AII" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Udaipur City", "station_code": "UDZ" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Kota", "station_code": "KOTA" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Alwar", "station_code": "AWR" },
    { "zone_name": "North Western Railway", "zone": "NWR", "station_name": "Sikar", "station_code": "SIKR" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Bilaspur", "station_code": "BSP" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Raipur", "station_code": "R" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Nagpur", "station_code": "NGP" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Gondia", "station_code": "G" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Durg", "station_code": "DURG" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Bhilai", "station_code": "BIA" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Bhatapara", "station_code": "BYT" },
    { "zone_name": "South East Central Railway", "zone": "SECR", "station_name": "Anuppur", "station_code": "APR" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "Guwahati", "station_code": "GHY" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "Dibrugarh", "station_code": "DBRG" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "New Jalpaiguri", "station_code": "NJP" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "Siliguri", "station_code": "SGUJ" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "Lumding", "station_code": "LMG" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "Tinsukia", "station_code": "TSK" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "Katihar", "station_code": "KIR" },
    { "zone_name": "North East Frontier Railway", "zone": "NFR", "station_name": "Bongaigaon", "station_code": "BNGN" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Kolkata Shalimar", "station_code": "SHM" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Kolkata Santragachi", "station_code": "SRC" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Kharagpur", "station_code": "KGP" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Tatanagar", "station_code": "TATA" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Ranchi", "station_code": "RNC" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Digha", "station_code": "DGHA" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Balasore", "station_code": "BLS" },
    { "zone_name": "South Eastern Railway", "zone": "SER", "station_name": "Rourkela", "station_code": "ROU" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Patna", "station_code": "PNBE" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Muzaffarpur", "station_code": "MFP" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Gaya", "station_code": "GAYA" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Hajipur", "station_code": "HJP" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Dhanbad", "station_code": "DHN" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Samastipur", "station_code": "SPJ" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Darbhanga", "station_code": "DBG" },
    { "zone_name": "East Central Railway", "zone": "ECR", "station_name": "Barauni", "station_code": "BJU" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Bhubaneswar", "station_code": "BBS" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Puri", "station_code": "PURI" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Visakhapatnam", "station_code": "VSKP" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Sambalpur", "station_code": "SBP" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Khurda Road", "station_code": "KUR" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Cuttack", "station_code": "CTC" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Berhampur", "station_code": "BAM" },
    { "zone_name": "East Coast Railway", "zone": "ECoR", "station_name": "Rayagada", "station_code": "RGDA" }
]

const router = new Router();

const baseUrl = 'http://localhost:8000/trains/';

const zones = [
    'NR', 'CR', 'WR', 'NER', 'SR', 'ER', 'SER', 'SCR', 'SWR', 'NCR', 'NWR', 'SECR', 'NFR', 'ECR', 'ECOR', 'CSTM', 'NE'
]


//Got the zones of the source and destination stations properly

router.get("/getZones", async (req, res) => {
    const src = req.query.src;
    const dest = req.query.dest;

    const response1 = await axios.get(baseUrl + `stationLive?code=${src}`);
    //response 1 does not give the correct information for every station, for example Darjeeling it wont give the data
    if (response1.data.data.length > 0) {
        const filterSrcExpressTrains = response1.data.data;

        let srcTrueZone, destTrueZone;

        for (const train of filterSrcExpressTrains) {
            const srcTrainRoute = (await axios.get(baseUrl + `getRoute?trainNo=${train.train_no}`)).data.data;
            const srcZone = srcTrainRoute.filter(station => {
                if (station.source_stn_code === src) return station;
            })[0].zone;
            console.log(srcZone);
            if (zones.includes(srcZone)) {
                srcTrueZone = srcZone;
                break;
            }
        }

        const response2 = await axios.get(baseUrl + `stationLive?code=${dest}`);
        const filterDestExpressTrains = response2.data.data;

        for (const train of filterDestExpressTrains) {
            const destTrainRoute = (await axios.get(baseUrl + `getRoute?trainNo=${train.train_no}`)).data.data;
            const destZone = destTrainRoute.filter(station => {
                if (station.source_stn_code === dest) return station;
            })[0].zone;
            console.log(destZone)
            if (zones.includes(destZone)) {
                destTrueZone = destZone;
                break;
            }
        }

        if (srcTrueZone === 'CSTM') srcTrueZone = 'CR';
        else if (destTrueZone === 'CSTM') destTrueZone = 'CR';
        if (zones.includes(srcTrueZone + 'R')) srcTrueZone = srcTrueZone + 'R'
        if (zones.includes(destTrueZone + 'R')) destTrueZone = destTrueZone + 'R'

        res.status(200).send({ data: { srcTrueZone, destTrueZone } })
    }
    else {
        //we will have to find a way for finding the zones or something else for these stations
        res.status(200).send({ data: { srcTrueZone: "no train on this station found", destTrueZone: "no train on this station found" } })
    }
});

// To get all the stations from the source zone and the destination zone
// and then get all the trains from the stations O(N*M)

// Auxiliary Functions
function getNextDate(dateStr) {
    // Split the input date string
    const [day, month, year] = dateStr.split('-').map(Number);

    // Create a new Date object (month is 0-based, so subtract 1)
    const date = new Date(year, month - 1, day);

    // Increment the date by one day
    date.setDate(date.getDate() + 1);

    // Extract the next day's day, month, and year
    const nextDay = date.getDate();
    const nextMonth = date.getMonth() + 1; // Months are 0-based, so add 1
    const nextYear = date.getFullYear();

    // Format the new date as DD-MM-YYYY, ensuring two digits for day and month
    const formattedNextDay = nextDay.toString().padStart(2, '0');
    const formattedNextMonth = nextMonth.toString().padStart(2, '0');

    return `${formattedNextDay}-${formattedNextMonth}-${nextYear}`;
}

// Checks cmopatibility of the date and time
function isCompatible(train1, train2) { // train1 is to reach a particular station, train 2 is to leave from that
    if (train1.date === train2.date) {
        return Number(train1.to_time) <= Number(train2.from_time);
    }
    else if (train2.date === getNextDate(train1.date)) {
        return true;
    }
    return false;
}

// Get new date
function addTimeToDate(dateStr, timeStr) {
    // Parse the date from 'DD-MM-YYYY' format
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());

    // Extract hours and minutes from the time string
    const [hours, minutes] = timeStr.split('.').map(Number);

    // Add hours and minutes to the parsed date
    const dateWithAddedHours = addHours(parsedDate, hours);
    const finalDate = addMinutes(dateWithAddedHours, minutes);

    console.log({parsedDate, hours, minutes, dateWithAddedHours, finalDate});

    // Format the final date as 'DD-MM-YYYY'
    return format(finalDate, 'dd-MM-yyyy');
}

router.get('/getLongTrains', async (req, res) => {
    const src = req.query.src;
    const dest = req.query.dest;
    const date = req.query.date;
    //DD-MM-YYYY
    const nextDate = getNextDate(date);

    const response = await axios.get(`http://localhost:8000/algo1/getZones?src=${src}&dest=${dest}`);
    const { srcTrueZone, destTrueZone } = response.data.data;

    const srcImpStations = stations.filter(station => station.zone === srcTrueZone);
    const destImpStations = stations.filter(station => station.zone === destTrueZone);

    console.log(srcImpStations, destImpStations);

    let allTrains = [];

    const directTrainsAvailable = await axios.get(baseUrl + `getTrainOn?from=${src}&to=${dest}&date=${date}`);
    const directTrainsAvailableOnNextDate = await axios.get(baseUrl + `getTrainOn?from=${src}&to=${dest}&date=${nextDate}`);

    if (directTrainsAvailable.data.data !== "No direct trains found") {
        allTrains = [...directTrainsAvailable.data.data];
    }
    if (directTrainsAvailableOnNextDate.data.data !== "No direct trains found") {
        allTrains = [...directTrainsAvailableOnNextDate.data.data];
    }

    console.log(allTrains);

    if (allTrains.length > 0) {
        return res.status(200).send({ data: allTrains, direct:true });
    }

    for (const srcStn of srcImpStations) {
        for (const destStn of destImpStations) {
            // console.log(srcStn, destStn)
            if (srcStn.station_code !== destStn.station_code) {

                const trainsAvailable = await axios.get(baseUrl + `getTrainOn?from=${srcStn.station_code}&to=${destStn.station_code}&date=${date}`);
                const trainsAvailableOnNextDate = await axios.get(baseUrl + `getTrainOn?from=${srcStn.station_code}&to=${destStn.station_code}&date=${nextDate}`);
                let trains = [];
                if (trainsAvailable.data.data !== "No direct trains found") {
                    trains = [...trainsAvailable.data.data];
                }
                if (trainsAvailableOnNextDate.data.data !== "No direct trains found") {
                    trains = [...trainsAvailableOnNextDate.data.data];
                }
                allTrains = [...trains, ...allTrains];
            }
        }
    }

    console.log("length:", allTrains.length);

    return res.status(200).send({ data: allTrains , direct:false })
})


router.get('/actualTrains', async (req, res) => {
    const src = req.query.src;
    const dest = req.query.dest;
    const date = req.query.date;
    const nextDate = getNextDate(date);

    //here, we get the long trains possible from the zones
    const response = await axios.get(`http://localhost:8000/algo1/getLongTrains?src=${src}&dest=${dest}&date=${date}`);
    const allTrains = response.data.data;
    const directTrains = response.data.direct;

    if(directTrains)
    return res.status(200).send({ data: allTrains});

    let train_ans = [];
    let src_trains = [];

    console.log({allTrains});

    //we run the loop for all the long trains found to find the 
    // trains from the actual source to source of long train and
    // then from destination of long train to our actual destination

    for (const long_train of allTrains) {
        // for source
        console.log({long_train});
        const virtual_src = long_train.train_base.from_stn_code;
        let src_train_list = []; //this list will store all the trains from the actual source to virtual source

        console.log({virtual_src});

        if (src !== virtual_src) {
            //if the actual source is not equal to the virtual source 
            // then we need to find the trains so we call the APIs on the same date as well as the next date
            const src_train_date = await axios.get(baseUrl + `getTrainOn?from=${src}&to=${virtual_src}&date=${date}`);
            const src_train_next_date = await axios.get(baseUrl + `getTrainOn?from=${src}&to=${virtual_src}&date=${nextDate}`);

            console.log({src_train_date:src_train_date.data.data, src_train_next_date:src_train_next_date.data.data});

            if (src_train_date.data.data !== "No direct trains found") {
                src_train_list = [...src_train_list,...src_train_date.data.data];
            }
            if (src_train_next_date.data.data !== "No direct trains found") {
                src_train_list = [...src_train_list,...src_train_next_date.data.data];
            }

            if(src_train_list.length > 0){
                for (const src_train of src_train_list) {
                    console.log({src_train});
                    if (isCompatible(src_train, long_train)) {
                        src_trains = [...src_trains , { src_train, long_train }];
                    }
                }
            }
            else{
                continue;
            }
        }
        else {
            src_trains = [...src_trains, { src_train: "None", long_train }];
        }


        return res.status(200).send({data:src_trains});
        console.log({src_trains});
        // for destination

        const virtual_dest = long_train.train_base.to_stn_code;
        console.log({virtual_dest});
        let dest_train_list = [];

        // the start date of each dest trains is supposed to be differernt for each source train ....add a loop for that
    
        const new_date = addTimeToDate(date,long_train.train_base.travel_time);
        console.log({new_date});
        const new_next_date = getNextDate(new_date);

        if (dest !== virtual_dest) {
            const dest_train_date = await axios.get(baseUrl + `getTrainOn?from=${virtual_dest}&to=${dest}&date=${new_date}`);
            const dest_train_next_date = await axios.get(baseUrl + `getTrainOn?from=${virtual_dest}&to=${dest}&date=${new_next_date}`);

            console.log({dest_train_date:dest_train_date.data.data, dest_train_next_date:dest_train_next_date.data.data});

            if (dest_train_date.data.data !== "No direct trains found") {
                dest_train_list = [...dest_train_list,...dest_train_date.data.data];
            }
            if (dest_train_next_date.data.data !== "No direct trains found") {
                dest_train_list = [...dest_train_list,...dest_train_next_date.data.data];
            }

            for (const dest_train of dest_train_list) {
                console.log({dest_train});
                if (isCompatible(long_train, dest_train)) {
                    for(const total_train of src_trains){
                        console.log({total_train});
                        // check format of this list
                        train_ans = [...train_ans, {...total_train, dest_train}];
                    }
                }
            }
        }
    }

    console.log({train_ans});

    return res.status(200).json({train_ans})
})


export default router;