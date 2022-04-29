import { PropertyType } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { IsAlpha, IsArray, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";

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

class Image {
    @IsString()
    @IsNotEmpty()
    url: string;
}
    


export class CreateHomeDto {

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsPositive()
    numberOfBedrooms: number;

    @IsNumber()
    @IsPositive()
    numberOfBathrooms: number;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    land_size: number;

    @IsEnum(PropertyType)
    propertyType: PropertyType;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Image)
    images: Image[]
}


export class UpdateHomeDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBedrooms?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBathrooms?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    land_size?: number;

    @IsOptional()
    @IsEnum(PropertyType)
    propertyType?: PropertyType;
}

export class InquireDto {
    @IsString()
    @IsNotEmpty()
    message: string;
}
