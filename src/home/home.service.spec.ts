import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';

const mockGetHomes = [
  {
    id: 2,
    address: "474 Yacht Str",
    city: "New York",
    price: 550000,
    property_type: PropertyType.RESIDENTIAL,
    image: "/url_image_2",
    number_of_bedrooms: 4,
    number_of_bathrooms: 3,
    images: [
      {
        url: "src1",
      }
    ]
  }
]

const mockHome = {
  id: 2,
  address: "474 Yacht Str",
  city: "New York",
  price: 550000,
  property_type: PropertyType.RESIDENTIAL,
  image: "/url_image_2",
  number_of_bedrooms: 4,
  number_of_bathrooms: 3
}

const mockImages = [
  {
    id: 1,
    url: "src1"
  },
  {
    id: 2,
    url: "src2"
  },
]

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService, {
        provide: PrismaService,
        useValue: {
          home: {
            findMany: jest.fn().mockReturnValue(mockGetHomes),
            create: jest.fn().mockReturnValue(mockHome),
          },
          image: {
            createMany: jest.fn().mockReturnValue(mockImages)
          }
        }
      }],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getHomes", () => {

    const filters = {
      city: "Toronto",
      price: {
        gte:100000,
        lte:700000
      },
      propertyType: PropertyType.RESIDENTIAL,
    }

    it("should call prisma home.findMany with correct params", async() => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest.spyOn(prismaService.home, "findMany").mockImplementation(mockPrismaFindManyHomes)
      
      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
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
            where: filters,
      })
    });

    it("should call prisma home.findMany with correct params", async() => { 
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest.spyOn(prismaService.home, 'findMany').mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      )
    })
  });

  describe('createHome', () => { 
    const mockCreateHomeParams = {
      address: "111 Yellow Str",
      numberOfBedrooms: 2,
      numberOfBathrooms: 2,
      city: "Vancouver",
      price: 560000,
      land_size:490,
      propertyType: PropertyType.RESIDENTIAL,
      images: [{
        url: "src1"
      }],
    }

    it("should call prisma home.create with the correct payload", async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome)

      jest.spyOn(prismaService.home, "create").mockImplementation(mockCreateHome);

      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: "111 Yellow Str",
          numbers_of_bathrooms: 2,
          numbers_of_bedrooms: 2,
          city: "Vancouver",
          price: 560000,
          land_size:490,
          propertyType: PropertyType.RESIDENTIAL,
          realtor_id: 1
        }
      })
    });

    it("should call prisma image.createMany with the correct payload", async () => {
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImages);

      jest.spyOn(prismaService.image, 'createMany').mockImplementation(mockCreateManyImage);

      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateManyImage).toBeCalledWith({
        data: 
          [{
            url: 'src1',
            home_id: 2,
          }]
      })

    });

  })
});
