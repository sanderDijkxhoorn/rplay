##vervang dit
bot_key="NTIwOTAyMjAzNzAwMDE5MjEw.Du0oPg.zbg2khcP0HDobK-abt6G2fny5Gc"
default_role="RainbowRole"
##--------------------
import discord
import asyncio
import time
from discord.ext.commands import Bot
from discord.ext import commands
from time import sleep
from colorsys import hls_to_rgb
client = commands.Bot(command_prefix = "*") #Initialise client bot
client = discord.Client()
dothething = {}
@client.event
async def on_ready():
        print('Logged in as')
        print(client.user.name)
        print(client.user.id)
        print('---------------------------------')
        await client.change_presence(status=discord.Status.dnd, game=discord.Game(name='type "*help" for help'))
@client.event
async def on_message(message):
        global dothething
        if message.author == client.user:
                return
        if message.content.startswith("*stop"):
                await client.send_message(message.channel,"stopped all")
                try:
                        dothething[str(message.server.id)]=0
                except:
                        print("error")
        if message.content.startswith("*invite"):
                await client.send_message(message.author, "https://discordapp.com/api/oauth2/authorize?client_id=520902203700019210&permissions=8&scope=bot")
        if message.content.startswith("*invite"):
                await client.send_message(message.channel, "Look at your dm {0.author.mention} :smiley:".format(message))
                print('Sended invite link to {0.author.mention}'.format(message))
        if message.content.startswith("*help"):
                await client.send_message(message.channel, "To start the bot type *start (the role you need to create is RainbowRole it need permissions otherwise it could not change anything.) *stop for stopping the rainbow role if need extra help or wanna buy fast version or anything like that contact ZYKI#0739")
        if message.content.startswith("*start"):
                await client.send_message(message.channel, "started")
                hue=0
                if message.content.strip().startswith("*start "):
                        role = discord.utils.find(lambda m: m.name == message.content[6:].strip() ,message.server.roles)
                else:
                        role = discord.utils.find(lambda m: m.name == default_role ,message.server.roles)
                try:
                        dothething[str(message.server.id)]
                except:
                        dothething[str(message.server.id)]=0
                if role and not dothething[str(message.server.id)]:
                        dothething[str(message.server.id)]=1
                        while dothething[str(message.server.id)]:
                                users = [int(str(x.status)=="online") for x in message.server.members if role in x.roles] #black magic fuckery here
                                users.append(0)
                                print(str(message.server.name)+" - "+str(users))
                                if max(users):
                                        for i in range(50): #arbitrary rate limits
                                                if not dothething[str(message.server.id)]:
                                                        break
                                                hue = (hue+7)%360
                                                rgb = [int(x*255) for x in hls_to_rgb(hue/360, 0.5, 1)]
                                                await asyncio.sleep(1/5)
                                                clr = discord.Colour(((rgb[0]<<16) + (rgb[1]<<8) + rgb[2]))
                                                try:
                                                        await client.edit_role(message.server, role, colour=clr)
                                                except:
                                                        print("no permissions on this server: " + str(message.server.name))
                                                        await client.send_message(message.channel, "I need permissions O.o")
                                                        dothething[str(message.server.id)]=0
                                else:
                                        await asyncio.sleep(10)
client.run(bot_key)

