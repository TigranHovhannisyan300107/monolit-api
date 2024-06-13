import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class JobSnapshot {
  @Prop()
  timestamp: string;

  @Prop()
  clientId: string;
}

export const JobSnapshotSchema = SchemaFactory.createForClass(JobSnapshot);

export const JobSnapshotModelDefinition: ModelDefinition = {
  name: JobSnapshot.name,
  schema: JobSnapshotSchema,
};
