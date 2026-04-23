import { PartialType } from '@nestjs/mapped-types';
import { CreateNedarimPlusSettingsDto } from './create-nedarim-plus-settings.dto';

export class UpdateNedarimPlusSettingsDto extends PartialType(
  CreateNedarimPlusSettingsDto,
) {}
