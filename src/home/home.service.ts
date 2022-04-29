import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

interface GetHomesParam {
    city?: string;
    price?: {
        gte?: number;
        lte?: number;
    };
    propertyType?: PropertyType;
}

interface CreateHomesParams {
    address: string;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    city: string;
    price: number;
    land_size: number;
    propertyType: PropertyType;
    images: {url: string}[];
}

interface UpdateHomesParams {
    address?: string;
    numberOfBedrooms?: number;
    numberOfBathrooms?: number;
    city?: string;
    price?: number;
    land_size?: number;
    propertyType?: PropertyType;
}

@Injectable()
export class HomeService {

    constructor(private readonly prismaService: PrismaService) {}

    async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany({

            select: {
                id: true,
                address: true,
                city: true,
                price: true,
                propertyType: true,
                numbers_of_bedrooms:  true,
                numbers_of_bathrooms:  true,
                images: {
                    select: {
                        url: true,
                    },
                    take: 1
                }
            }, 
            where: filter,
        });

        if(!homes.length) {
            throw new NotFoundException();
        }

        return homes.map(
            (home) => {
                const fetchHome = { ...home, image: home.images[0].url };
                delete fetchHome.images;
                return new HomeResponseDto(fetchHome);
            }
        );
    }

    async getHomeById(id: number): Promise<HomeResponseDto> {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            }
        });

        if(!home) {
            throw new NotFoundException();
        }

        return new HomeResponseDto(home);
    }

    async createHome({
        address,
        city,
        price,
        land_size,
        propertyType,
        numberOfBedrooms,
        numberOfBathrooms,
        images
    }: CreateHomesParams,
        userId: number 
    ){
        const home = await this.prismaService.home.create({
            data: {
                address,
                city,
                price,
                land_size,
                propertyType,
                numbers_of_bedrooms: numberOfBedrooms,
                numbers_of_bathrooms: numberOfBathrooms,
                realtor_id: userId
            }
        })

        const homeImages = images.map(image => {
            return {...image, home_id: home.id}
        })

        await this.prismaService.image.createMany({ data: homeImages });

        return new HomeResponseDto(home);
    }

    async updateHomeById(id: number, data: UpdateHomesParams) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            }
        });

        if(!home) {
            throw new NotFoundException();
        }

        const updateHome = await this.prismaService.home.update({
            where: {
                id
            },
            data
        })

        return new HomeResponseDto(updateHome);
    }

    async deleteHomeById(id: number){
        await this.prismaService.image.deleteMany({
            where: {
                home_id: id
            }
        });

        await this.prismaService.home.delete({
            where: {
                id,
            }
        });
    }

    async getRealtorByHomeId(id: number) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            },
            select: {
                realtor: {
                    select: {
                        name: true,
                        id: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        })

        if(!home) {
            throw new NotFoundException();
        }

        return home.realtor;
    }
}
