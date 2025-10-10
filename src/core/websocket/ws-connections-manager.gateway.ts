import { Inject, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { isString } from 'node:util';
import { AccessTokenPayload } from '../authentication/interfaces/access-token-payload.interface';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

export class WsConnectionsManagerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WsConnectionsManagerGateway.name);
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnect`);
    client.rooms.clear();
  }
  async handleConnection(client: Socket) {
    const token = this.extractTokenFromSocket(client);
    if (!token) {
      client.disconnect(true);
      this.logger.log('no AccessToken provided');
      return;
    }
    const payload = await this.validateToken(token);
    if (!payload) {
      client.disconnect();
      return;
    }
    const user = await this.validateUser(payload.sub);
    if (!user) {
      client.disconnect();
      return;
    }
    const userPayload: AccessTokenPayload['user'] = {
      id: user.id,
      email: user.email,
    };
    const getuserRooms = this.getUserRoomFromSocket(client);
    client['user'] = userPayload;
    await client.join(getuserRooms);
  }
  getUserRoomFromSocket(client: Socket): string {
    const user = client['user'] as AccessTokenPayload['user'];
    if (!user) {
      client.disconnect(true);
    }
    const userRoom = `user_${user.id}`;
    return userRoom;
  }
  getUserFromSocket(client: Socket): AccessTokenPayload['user'] {
    return client['user'] as AccessTokenPayload['user'];
  }

  extractTokenFromSocket(client: Socket): string | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const RawToken =
      client.handshake.auth['token'] ||
      client.handshake.headers['authorization'];
    if (!RawToken) {
      return null;
    }
    if (!isString(RawToken)) {
      return null;
    }

    const [claim, token] = RawToken.split(' ') || [];

    if (claim !== 'Bearer') {
      return null;
    }

    return token || null;
  }
  async validateUser(userId: string): Promise<User | null> {
    const user = await this.userService.findById(userId);
    if (!user) {
      return null;
    }
    return user;
  }
  async validateToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      const payload =
        await this.jwtService.verifyAsync<AccessTokenPayload>(token);
      return payload;
    } catch (e) {
      this.logger.error('Token validation error', e);
      return null;
    }
  }
}
