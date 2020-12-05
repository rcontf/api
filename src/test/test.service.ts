import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTestDto } from './dto/test.dto';
import { Test, TestDocument } from './schemas/test.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private readonly testModel: Model<TestDocument>,
  ) {}

  async findAll(): Promise<Test[]> {
    return this.testModel.find({});
  }

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const doc = new this.testModel(createTestDto);
    return doc.save();
  }
}
