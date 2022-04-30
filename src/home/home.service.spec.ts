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
    propertyType: PropertyType.RESIDENTIAL,
    image: "/url_image_2",
    numberOfBedrooms: 4,
    numberOfBathrooms: 3,
    images: [
      {
        url: "src1",
      }
    ]
  }
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
            findMany: jest.fn().mockReturnValue(mockGetHomes)
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
});
