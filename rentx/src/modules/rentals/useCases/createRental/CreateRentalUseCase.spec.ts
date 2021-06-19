import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe("Create Rental", () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      car_id: "ADF-123",
      user_id: "765432_",
      expected_return_date: new Date(),
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "ADF-123",
        user_id: "765432_",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        car_id: "ADF-321",
        user_id: "765432_",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if there is another open to the same car", () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "ADF-123",
        user_id: "897655_",
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        car_id: "ADF-123",
        user_id: "375989_",
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
