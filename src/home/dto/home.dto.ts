import { PropertyType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class HomeResponseDto {
    id: number;
    address: string;

    @Exclude()
    numbers_of_bedrooms: number;

    @Expose({ name: "numberOfBedrooms" })
    numberOfBedrooms(){
        return this.numbers_of_bedrooms;
    }

    @Exclude()
    numbers_of_bathrooms: number;

    @Expose({ name: "numberOfBathrooms" })
    numberOfBathrooms() {
        return this.numbers_of_bathrooms;
    }

    city: string;

    @Exclude()
    listed_date: Date;

    @Expose({ name: "listedDate" })
    listedDate() {
        return this.listed_date;
    }

    
    price: number;

    image: string;
    
    land_size: number;
    propertyType: PropertyType;

    @Exclude()
    created_at: Date;
    @Exclude()
    updated_at: Date;
    @Exclude()
    realtor_id: number;

    constructor(paritial: Partial<HomeResponseDto>) {
        Object.assign(this, paritial);
    }
}