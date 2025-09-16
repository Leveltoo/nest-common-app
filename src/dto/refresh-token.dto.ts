import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 刷新令牌DTO
 * 用于刷新JWT令牌请求的数据验证
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @IsString()
  refreshToken: string;
}
